import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const SECRET_NAME = "stockpulse/config";
const REGION = "ap-northeast-2";

interface StockPulseSecrets {
  NEXTAUTH_SECRET: string;
  KAKAO_CLIENT_ID: string;
  KAKAO_CLIENT_SECRET: string;
  NAVER_CLIENT_ID: string;
  NAVER_CLIENT_SECRET: string;
  AWS_REGION: string;
}

let cachedSecrets: StockPulseSecrets | null = null;

/**
 * AWS Secrets Manager에서 시크릿을 로드합니다.
 * 한 번 로드 후 메모리에 캐싱됩니다.
 */
export async function getSecrets(): Promise<StockPulseSecrets> {
  if (cachedSecrets) return cachedSecrets;

  const client = new SecretsManagerClient({ region: REGION });

  const response = await client.send(
    new GetSecretValueCommand({ SecretId: SECRET_NAME })
  );

  if (!response.SecretString) {
    throw new Error(`Secret ${SECRET_NAME} has no string value`);
  }

  cachedSecrets = JSON.parse(response.SecretString) as StockPulseSecrets;
  return cachedSecrets;
}

/**
 * 시크릿을 환경변수로 로드합니다.
 * 서버 시작 시 호출하면 process.env에 주입됩니다.
 */
export async function loadSecretsToEnv(): Promise<void> {
  try {
    const secrets = await getSecrets();

    for (const [key, value] of Object.entries(secrets)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }

    console.log("[Secrets] Loaded from AWS Secrets Manager");
  } catch (error) {
    console.warn(
      "[Secrets] Failed to load from AWS Secrets Manager, using .env.local fallback",
      error instanceof Error ? error.message : error
    );
  }
}
