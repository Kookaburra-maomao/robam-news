import { mkdirSync, copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "..");
const sourceRoot = path.join(workspaceRoot, "output", "ai_daily");
const publicRoot = path.join(process.cwd(), "public", "archive");
const dataOutput = path.join(process.cwd(), "app", "reports-data.ts");
const archiveStartDate = "2026-08-24";

const categoryMap = [
  ["具身智能", ["机器人", "具身", "人形", "灵巧手", "家务", "陪伴", "Galbot", "宇树", "章鱼动力", "WRC"]],
  ["厨房智能硬件", ["厨", "烹饪", "炒菜", "烟机", "灶", "蒸烤", "厨电", "冰箱", "水槽", "咖啡", "炸鸡", "冰淇淋"]],
  ["大模型算法", ["大模型", "模型", "Agent", "智能体", "算法", "端侧", "AI芯片", "RISC-V", "算力", "世界模型"]],
  ["厨房空间设计", ["空间", "开放式", "套系", "全屋", "收纳", "动线", "厨房生活", "嵌入式", "定制", "整案交付"]],
  ["厨房品类创新", ["新品", "新厨电", "品类", "跨品类", "套装", "解决方案", "单品", "创新", "白皮书", "感知价值"]],
  ["厨房工业设计", ["工业设计", "CMF", "材质", "工艺", "形态", "交互", "面板", "设计", "无拉手", "全嵌", "双TFT"]],
];

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&emsp;/g, " ")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function matchAll(regex, value) {
  return [...value.matchAll(regex)].map((match) => match[1]);
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function isLocalAsset(value) {
  return value && !/^(?:[a-z]+:)?\/\//i.test(value) && !value.startsWith("/") && !value.startsWith("#") && !value.startsWith("data:");
}

function tagsFor(text) {
  const tags = [];
  for (const [tag, words] of categoryMap) {
    if (words.some((word) => text.includes(word))) tags.push(tag);
  }
  if (!tags.length) tags.push("大模型算法");
  return tags;
}

function findPreview(dir, date) {
  const names = [
    `AI未来厨房新闻报_预览图_${date}.png`,
    `数字厨电新闻报_预览图_${date}.png`,
    `hangyan_news_${date}_compressed.png`,
    `hangyan_news_${date}.png`,
  ];
  return names.map((name) => path.join(dir, name)).find((file) => existsSync(file));
}

function writePreview(src, destDir) {
  const dest = path.join(destDir, "preview.jpg");
  try {
    execFileSync(
      "sips",
      ["-s", "format", "jpeg", "-s", "formatOptions", "74", "--resampleWidth", "1200", src, "--out", dest],
      { stdio: "ignore" },
    );
    return "preview.jpg";
  } catch {
    const fallback = path.join(destDir, "preview.png");
    copyFileSync(src, fallback);
    return "preview.png";
  }
}

function copyReferencedAssets(html, sourceDir, destDir) {
  const refs = [
    ...matchAll(/<img[^>]+src=["']([^"']+)["']/gi, html),
    ...matchAll(/url\(["']?([^"')]+)["']?\)/gi, html),
  ].map(decodeHtml);

  const copied = [];
  for (const ref of new Set(refs.filter(isLocalAsset))) {
    const cleanRef = ref.split("#")[0].split("?")[0];
    const srcPath = path.normalize(path.join(sourceDir, cleanRef));
    if (!srcPath.startsWith(sourceDir) || !existsSync(srcPath)) continue;

    const destPath = path.join(destDir, cleanRef);
    mkdirSync(path.dirname(destPath), { recursive: true });
    copyFileSync(srcPath, destPath);
    copied.push(cleanRef);
  }
  return copied;
}

function heroForImageRef(ref, date, copiedAssets, previewName) {
  if (!ref) return previewName ? `/archive/${date}/${previewName}` : "";
  const decoded = decodeHtml(ref);
  if (/^(?:[a-z]+:)?\/\//i.test(decoded)) return decoded;
  if (decoded.startsWith("/") || decoded.startsWith("#") || decoded.startsWith("data:")) {
    return previewName ? `/archive/${date}/${previewName}` : "";
  }

  const cleanRef = decoded.split("#")[0].split("?")[0];
  if (copiedAssets.includes(cleanRef)) return `/archive/${date}/${cleanRef}`;
  return previewName ? `/archive/${date}/${previewName}` : "";
}

function bestHtml(dir, date) {
  const preferred = path.join(dir, `hangyan_news_${date}.html`);
  if (existsSync(preferred)) return preferred;
  const htmlFiles = readdirSync(dir).filter((name) => /^hangyan_news_.*\.html$/.test(name));
  if (!htmlFiles.length) return null;
  return path.join(dir, htmlFiles.sort()[htmlFiles.length - 1]);
}

rmSync(publicRoot, { recursive: true, force: true });
mkdirSync(publicRoot, { recursive: true });

const reports = [];
for (const entry of readdirSync(sourceRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/.test(entry.name)) continue;

  const date = entry.name;
  if (date < archiveStartDate) continue;

  const dir = path.join(sourceRoot, date);
  const htmlPath = bestHtml(dir, date);
  if (!htmlPath) continue;

  const html = readFileSync(htmlPath, "utf8");
  const issueMatch = html.match(/总第\s*([0-9]+)\s*期/);
  const titleMatches = matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, html).map(stripTags);
  const noteMatch = html.match(/<section class="editor-note"[^>]*>([\s\S]*?)<div class="source-strip/);
  const fallbackDek = html.match(/<p class="dek"[^>]*>([\s\S]*?)<\/p>/i);
  const summary = stripTags(noteMatch?.[1] || fallbackDek?.[1] || titleMatches[0] || "今日 AI 未来厨房行业动态");
  const articleTags = titleMatches.slice(0, 8).map((title) => ({ title, tags: tagsFor(title) }));
  const tagText = `${titleMatches.join(" ")} ${summary}`;
  const tags = [...new Set([...tagsFor(tagText), ...articleTags.flatMap((article) => article.tags)])];
  const firstImage = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || "";

  const destDir = path.join(publicRoot, date);
  mkdirSync(destDir, { recursive: true });
  copyFileSync(htmlPath, path.join(destDir, "index.html"));
  const copiedAssets = copyReferencedAssets(html, dir, destDir);

  const preview = findPreview(dir, date);
  const previewName = preview ? writePreview(preview, destDir) : "";
  const hero = heroForImageRef(firstImage, date, copiedAssets, previewName);

  reports.push({
    date,
    weekday: new Intl.DateTimeFormat("zh-CN", { weekday: "long", timeZone: "Asia/Shanghai" }).format(new Date(`${date}T00:00:00+08:00`)),
    issue: issueMatch ? `第 ${issueMatch[1]} 期` : "",
    title: "AI未来厨房新闻报",
    summary,
    hero,
    reportUrl: `/archive/${date}/`,
    tags,
    articles: articleTags,
  });
}

reports.sort((a, b) => b.date.localeCompare(a.date));

const content = `export type NewsArticle = { title: string; tags: string[] };\n\nexport type NewsReport = {\n  date: string;\n  weekday: string;\n  issue: string;\n  title: string;\n  summary: string;\n  hero: string;\n  reportUrl: string;\n  tags: string[];\n  articles: NewsArticle[];\n};\n\nexport const categories = [\"全部\", \"具身智能\", \"厨房智能硬件\", \"大模型算法\", \"厨房空间设计\", \"厨房品类创新\", \"厨房工业设计\"] as const;\n\nexport const archiveStartDate = ${JSON.stringify(archiveStartDate)};\n\nexport const reports: NewsReport[] = ${JSON.stringify(reports, null, 2)};\n`;

writeFileSync(dataOutput, content);
console.log(`Synced ${reports.length} reports to ${publicRoot}`);
