import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 静态站点构建：输出纯静态产物，由 Nginx 托管，不依赖 vinext / Cloudflare Workers。
// base 使用相对路径，方便挂载在 ECS 的 /ainews/ 子路径下。
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist-static",
    emptyOutDir: true,
  },
  publicDir: "public",
});
