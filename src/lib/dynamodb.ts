import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-northeast-2",
});

const ddb = DynamoDBDocumentClient.from(client);

const TABLES = {
  chat: "stockpulse-chat",
  news: "stockpulse-news",
  stocks: "stockpulse-stocks",
  users: "stockpulse-users",
  alerts: "stockpulse-alerts",
} as const;

// ━━━ Chat ━━━

export async function putChatMessage(msg: {
  room: string;
  userId: string;
  nickname: string;
  content: string;
}) {
  const timestamp = Date.now();
  await ddb.send(
    new PutCommand({
      TableName: TABLES.chat,
      Item: { ...msg, timestamp },
    })
  );
  return { ...msg, timestamp };
}

export async function getChatMessages(room: string, limit = 50) {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLES.chat,
      KeyConditionExpression: "room = :r",
      ExpressionAttributeValues: { ":r": room },
      ScanIndexForward: false, // 최신순
      Limit: limit,
    })
  );
  return (result.Items || []).reverse(); // 시간순 정렬
}

// ━━━ News ━━━

export async function putNewsItem(news: {
  source: string;
  title: string;
  tags: string[];
  views: number;
  sentiment: string;
  url?: string;
}) {
  const timestamp = Date.now();
  await ddb.send(
    new PutCommand({
      TableName: TABLES.news,
      Item: { ...news, timestamp },
    })
  );
  return { ...news, timestamp };
}

export async function getNewsBySource(source: string, limit = 20) {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLES.news,
      KeyConditionExpression: "source = :s",
      ExpressionAttributeValues: { ":s": source },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return result.Items || [];
}

export async function getAllNews(limit = 50) {
  const result = await ddb.send(
    new ScanCommand({
      TableName: TABLES.news,
      Limit: limit,
    })
  );
  return (result.Items || []).sort(
    (a, b) => (b.timestamp as number) - (a.timestamp as number)
  );
}

// ━━━ Stocks ━━━

export async function putStockData(stock: {
  code: string;
  date: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
}) {
  await ddb.send(
    new PutCommand({
      TableName: TABLES.stocks,
      Item: stock,
    })
  );
  return stock;
}

export async function getStockHistory(code: string, limit = 30) {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLES.stocks,
      KeyConditionExpression: "code = :c",
      ExpressionAttributeValues: { ":c": code },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return result.Items || [];
}

// ━━━ Users ━━━

export async function putUser(user: {
  userId: string;
  nickname: string;
  email?: string;
}) {
  const createdAt = Date.now();
  await ddb.send(
    new PutCommand({
      TableName: TABLES.users,
      Item: { ...user, createdAt },
    })
  );
  return { ...user, createdAt };
}

// ━━━ Alerts ━━━

export async function putAlert(alert: {
  userId: string;
  stockCode: string;
  stockName: string;
  targetPrice: number;
  direction: "above" | "below";
}) {
  const createdAt = Date.now();
  const item = { ...alert, createdAt, active: true };
  await ddb.send(
    new PutCommand({
      TableName: TABLES.alerts,
      Item: item,
    })
  );
  return item;
}

export async function getAlerts(userId: string) {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLES.alerts,
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": userId },
      ScanIndexForward: false,
    })
  );
  return result.Items || [];
}

export async function deleteAlert(userId: string, createdAt: number) {
  await ddb.send(
    new DeleteCommand({
      TableName: TABLES.alerts,
      Key: { userId, createdAt },
    })
  );
}

export { ddb, TABLES };
