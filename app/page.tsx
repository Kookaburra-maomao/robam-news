"use client";

import { useMemo, useState } from "react";
import { archiveStartDate, categories, reports } from "./reports-data";

const featuredTags = ["AI技术趋势", "用户趋势", "设计趋势", "国家政策", "竞品动态"];

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}

function reportMatches(report: (typeof reports)[number], category: string) {
  if (category === "全部") return true;
  return (
    report.tags.includes(category) ||
    report.articles.some((article) => article.tags.includes(category))
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("全部");

  const filteredReports = useMemo(
    () => reports.filter((report) => reportMatches(report, activeCategory)),
    [activeCategory],
  );
  const latest = reports[0];
  const lead = filteredReports[0] ?? latest;
  const secondary = filteredReports.slice(1, 4);
  const archive = filteredReports;

  const tagCounts = useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] = reports.filter((report) => reportMatches(report, category)).length;
      return acc;
    }, {});
  }, []);

  return (
    <main className="site-shell">
      <header className="paper-header">
        <div className="utility-line">
          <span>ROBAM AI EDITORIAL DESK</span>
          <span>历史日报馆 · H5 归档 · 趋势索引</span>
          <span>{latest ? `${formatDate(latest.date)} 更新` : `${formatDate(archiveStartDate)} 起收录`}</span>
        </div>
        <section className="masthead-panel">
          <div>
            <p className="eyebrow">AI Future Kitchen Journal</p>
            <h1>AI未来厨房新闻报</h1>
          </div>
          <p>
            持续沉淀厨房智能硬件、具身智能、大模型算法、设计趋势、
            用户趋势、国家政策与竞品动态的每日情报。
          </p>
        </section>
        <nav className="category-rail" aria-label="新闻分类">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "active" : ""}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              <span>{category}</span>
              <small>{tagCounts[category]}</small>
            </button>
          ))}
        </nav>
      </header>

      {lead ? (
        <section className="front-page">
          <article className="lead-story">
            <a href={lead.reportUrl} target="_blank" rel="noreferrer" aria-label={`打开 ${lead.date} 日报`}>
              {lead.hero ? <img src={lead.hero} alt={`${lead.date} 新闻头图`} /> : null}
            </a>
            <div className="lead-copy">
              <p className="section-name">今日头版</p>
              <h2>{formatDate(lead.date)} · {lead.title}</h2>
              <p className="summary">{lead.summary}</p>
              <div className="tag-row">
                {lead.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a className="read-link" href={lead.reportUrl} target="_blank" rel="noreferrer">
                阅读 H5 报纸
              </a>
            </div>
          </article>

          <aside className="editorial-column">
            <p className="section-name">栏目观察</p>
            <h3>新增关注面</h3>
            <div className="feature-list">
              {featuredTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveCategory(tag as (typeof categories)[number])}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
            <p>
              明日起抓取范围会扩展到 AI 技术趋势、用户趋势、设计趋势、国家政策和竞品动态，
              用更完整的视角沉淀未来厨房情报。
            </p>
          </aside>
        </section>
      ) : (
        <section className="empty-front">
          <p className="section-name">Archive Reset</p>
          <h2>{formatDate(archiveStartDate)} 起重新开馆</h2>
          <p>
            历史日报已清除。新闻馆将从 2026 年 8 月 24 日开始，重新沉淀 AI 未来厨房方向的每日情报。
          </p>
        </section>
      )}

      <section className="daily-grid" aria-label="近期日报">
        {secondary.map((report) => (
          <article className="issue-card" key={report.date}>
            <a href={report.reportUrl} target="_blank" rel="noreferrer">
              {report.hero ? <img src={report.hero} alt={`${report.date} 新闻头图`} /> : null}
            </a>
            <div>
              <p className="date-line">{formatDate(report.date)} · {report.weekday}</p>
              <h3>{report.articles[0]?.title ?? report.title}</h3>
              <p>{report.summary}</p>
              <div className="mini-tags">
                {report.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="archive-section">
        <div className="section-heading">
          <p className="section-name">Daily Archive</p>
          <h2>{activeCategory === "全部" ? "全部日报" : activeCategory}</h2>
          <span>{filteredReports.length} 期</span>
        </div>
        <div className="archive-list">
          {archive.map((report) => (
            <article className="archive-item" key={report.date}>
              <div className="date-block">
                <strong>{report.date.slice(8)}</strong>
                <span>{report.date.slice(0, 7)}</span>
              </div>
              <div>
                <a href={report.reportUrl} target="_blank" rel="noreferrer">
                  <h3>{report.articles[0]?.title ?? report.title}</h3>
                </a>
                <p>{report.articles.slice(1, 4).map((article) => article.title).join(" / ")}</p>
                <div className="mini-tags">
                  {report.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <a className="small-read" href={report.reportUrl} target="_blank" rel="noreferrer">
                打开
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
