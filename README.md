# AI未来厨房新闻报

老板电器 AI 未来厨房新闻报历史日报馆。站点收集每日 H5 报纸、预览图和新闻标签，支持按日期与栏目浏览。

## 部署说明

当前线上 `http://39.106.139.252/ainews/` 仍然使用 ECS + Nginx 静态托管，不需要 Cloudflare Workers 运行时。

更新 ECS 时使用：

```bash
git pull
npm install
npm run build:static
```

构建产物会生成在：

```text
dist-static/
```

将 `dist-static/` 发布到 Nginx 的 `/ainews/` 对应目录即可。静态构建使用相对资源路径，支持挂载在 `/ainews/` 子路径下。

## 常用命令

- `node scripts/sync-reports.mjs`：从 `/Users/zhangyumou/1_robam/output/ai_daily` 同步日报到 `public/archive` 并生成 `app/reports-data.ts`。
- `npm run build:static`：生成 ECS/Nginx 使用的纯静态产物。
- `npm run dev`：本地 vinext 开发预览。
- `npm run build`：vinext 构建校验。

如果日报源目录不在默认位置，可通过环境变量覆盖：

```bash
ROBAM_NEWS_SOURCE_ROOT=/path/to/output/ai_daily node scripts/sync-reports.mjs
```
