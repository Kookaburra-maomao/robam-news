import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("news archive source is wired to the finished product", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const data = await readFile(new URL("../app/reports-data.ts", import.meta.url), "utf8");

  assert.match(layout, /AI未来厨房新闻报/);
  assert.match(page, /category-rail/);
  assert.match(page, /阅读 H5 报纸/);
  assert.match(data, /厨房空间设计/);
  assert.doesNotMatch(page + layout, /SkeletonPreview|codex-preview|Your site is taking shape/);
});
