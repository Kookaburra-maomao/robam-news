import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 静态站点构建：输出纯静态产物（HTML/JS/CSS），由 Nginx 直接托管，
// 不依赖 vinext / Cloudflare Workers 运行时。base 用相对路径，站点可挂载在任意子路径下。
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist-static",
    emptyOutDir: true,
  },
  publicDir: "public",
});
