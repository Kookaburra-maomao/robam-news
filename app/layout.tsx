import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI未来厨房新闻报",
  description: "老板电器 AI 未来厨房新闻报历史日报馆，沉淀厨房智能硬件、具身智能、大模型算法与厨房设计趋势。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "AI未来厨房新闻报",
    description: "按日期与栏目沉淀每日 AI 未来厨房情报。",
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
