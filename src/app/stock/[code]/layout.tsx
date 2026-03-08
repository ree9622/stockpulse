import { STOCK_LIST } from "@/lib/stock-list";

export function generateStaticParams() {
  return STOCK_LIST.map((s) => ({ code: s.code }));
}

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
