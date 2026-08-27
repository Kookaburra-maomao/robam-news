import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI未来厨房新闻报",
  description: "老板电器 AI 未来厨房新闻报历史日报馆，沉淀厨房智能硬件、具身智能、AI技术趋势、用户趋势、设计趋势、国家政策与竞品动态。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "AI未来厨房新闻报",
    description: "按日期与栏目沉淀每日 AI 未来厨房、用户、设计、政策与竞品情报。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
