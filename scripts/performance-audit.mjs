#!/usr/bin/env node
/**
 * Mobile performance audit (Lighthouse + resource summary).
 *
 * Usage:
 *   npm run perf:audit
 *   npm run perf:audit -- --url https://www.dembitskyi.com/uk/
 *   npm run perf:audit -- --pages home,services --base https://www.dembitskyi.com
 *   npm run perf:audit -- --local   # starts `next start` on :3000 if needed
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT, "reports", "performance");

const DEFAULT_PAGES = {
  home: "/uk/",
  services: "/uk/services",
};

function parseArgs(argv) {
  const opts = {
    base: process.env.PERF_BASE_URL || "https://www.dembitskyi.com",
    pages: Object.keys(DEFAULT_PAGES),
    local: false,
    port: Number(process.env.PERF_PORT || 3000),
    runs: 1,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--local") opts.local = true;
    else if (arg === "--url") opts.pages = ["custom"];
    else if (arg.startsWith("--url=")) {
      opts.base = arg.slice(6).replace(/\/$/, "");
      opts.pages = ["custom"];
    } else if (arg === "--base") opts.base = argv[++i]?.replace(/\/$/, "") || opts.base;
    else if (arg.startsWith("--base=")) opts.base = arg.slice(7).replace(/\/$/, "");
    else if (arg === "--pages") opts.pages = (argv[++i] || "").split(",").filter(Boolean);
    else if (arg.startsWith("--pages="))
      opts.pages = arg.slice(8).split(",").filter(Boolean);
    else if (arg === "--port") opts.port = Number(argv[++i] || 3000);
    else if (arg === "--runs") opts.runs = Math.max(1, Number(argv[++i] || 1));
  }

  if (opts.pages.includes("custom") && argv.includes("--url")) {
    const urlArg = argv[argv.indexOf("--url") + 1];
    if (urlArg && !urlArg.startsWith("--")) {
      opts.customUrl = urlArg;
    }
  }

  return opts;
}

function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (res.ok || res.status < 500) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error(`Server not ready: ${url}`));
      }
      setTimeout(tick, 800);
    };
    tick();
  });
}

function startNextServer(port) {
  const child = spawn("npm", ["run", "start", "--", "-p", String(port)], {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, PORT: String(port) },
  });
  return child;
}

function ms(value) {
  return typeof value === "number" ? `${Math.round(value)} ms` : "n/a";
}

function scoreColor(score) {
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "avg";
  return "poor";
}

function formatAuditReport({ label, url, lhr }) {
  const perf = lhr.categories.performance;
  const audits = lhr.audits;

  const metrics = [
    "first-contentful-paint",
    "largest-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
    "speed-index",
    "interactive",
  ].map((id) => {
    const a = audits[id];
    return a
      ? { id, title: a.title, value: a.displayValue || ms(a.numericValue), score: a.score }
      : null;
  }).filter(Boolean);

  const opportunities = Object.values(audits)
    .filter(
      (a) =>
        a.details?.type &&
        (a.details.type === "opportunity" || a.details.type === "table") &&
        a.score !== null &&
        a.score < 1 &&
        a.numericValue,
    )
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, 12)
    .map((a) => ({
      id: a.id,
      title: a.title,
      savings: a.displayValue || ms(a.numericValue),
      score: a.score,
    }));

  const diagnostics = [
    "render-blocking-resources",
    "unused-javascript",
    "legacy-javascript",
    "uses-long-cache-ttl",
    "total-byte-weight",
    "network-requests",
    "network-rtt",
    "largest-contentful-paint-element",
    "prioritize-lcp-image",
    "lcp-lazy-loaded",
    "critical-request-chains",
    "dom-size",
  ]
    .map((id) => audits[id])
    .filter(Boolean)
    .map((a) => ({
      id: a.id,
      title: a.title,
      value: a.displayValue || (a.details?.items?.length ? `${a.details.items.length} items` : ""),
      score: a.score,
      description: a.description?.replace(/\[.*?\]\(.*?\)/g, "")?.slice(0, 200),
    }));

  const renderBlocking =
    audits["render-blocking-resources"]?.details?.items?.map((item) => ({
      url: item.url,
      wastedMs: item.wastedMs,
    })) || [];

  const unusedJs =
    audits["unused-javascript"]?.details?.items?.map((item) => ({
      url: item.url,
      wastedBytes: item.wastedBytes,
      wastedPercent: item.wastedPercent,
    })) || [];

  const lcpElement = audits["largest-contentful-paint-element"]?.details?.items?.[0];

  return {
    label,
    url,
    fetchedAt: new Date().toISOString(),
    performanceScore: perf.score,
    performanceScorePercent: Math.round((perf.score || 0) * 100),
    metrics,
    opportunities,
    diagnostics,
    renderBlocking,
    unusedJs,
    lcpElement: lcpElement
      ? { node: lcpElement.node?.snippet, url: lcpElement.url }
      : null,
    rawCategories: lhr.categories,
  };
}

function writeMarkdownSummary(reports) {
  const lines = [
    "# Performance audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
  ];

  for (const r of reports) {
    lines.push(`## ${r.label}`);
    lines.push(`- URL: ${r.url}`);
    lines.push(
      `- Performance score: **${r.performanceScorePercent}** (${scoreColor(r.performanceScore)})`,
    );
    lines.push("");
    lines.push("### Core metrics");
    for (const m of r.metrics) {
      lines.push(`- ${m.title}: ${m.value}`);
    }
    lines.push("");
    if (r.lcpElement) {
      lines.push("### LCP element");
      lines.push("```html");
      lines.push((r.lcpElement.node || r.lcpElement.url || "").trim());
      lines.push("```");
      lines.push("");
    }
    if (r.opportunities.length) {
      lines.push("### Top opportunities");
      for (const o of r.opportunities) {
        lines.push(`- **${o.title}** — ${o.savings}`);
      }
      lines.push("");
    }
    if (r.renderBlocking.length) {
      lines.push("### Render-blocking resources");
      for (const rb of r.renderBlocking.slice(0, 8)) {
        lines.push(`- ${rb.url} (${ms(rb.wastedMs)})`);
      }
      lines.push("");
    }
    if (r.unusedJs.length) {
      lines.push("### Unused JavaScript (top)");
      for (const u of r.unusedJs.slice(0, 8)) {
        const kb = Math.round((u.wastedBytes || 0) / 1024);
        lines.push(`- ${u.url} — ~${kb} KiB unused (${Math.round(u.wastedPercent || 0)}%)`);
      }
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

async function runLighthouse(url, chrome) {
  const options = {
    logLevel: "error",
    output: "json",
    onlyCategories: ["performance"],
    port: chrome.port,
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 2.625 },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
  };

  const runnerResult = await lighthouse(url, options);
  return runnerResult.lhr;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  let serverProcess = null;
  if (opts.local) {
    const localBase = `http://localhost:${opts.port}`;
    try {
      await waitForServer(localBase, 3_000);
      console.log(`Using running server at ${localBase}`);
    } catch {
      console.log(`Starting Next.js on port ${opts.port}...`);
      serverProcess = startNextServer(opts.port);
      await waitForServer(localBase, 120_000);
    }
    opts.base = localBase;
  }

  const urls =
    opts.customUrl != null
      ? [{ label: "custom", path: opts.customUrl }]
      : opts.pages.map((key) => ({
          label: key,
          path:
            key === "custom"
              ? opts.base
              : `${opts.base}${DEFAULT_PAGES[key] || `/${key}`}`,
        }));

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });

  const reports = [];

  try {
    for (const { label, path: target } of urls) {
      const url = target.startsWith("http") ? target : `${opts.base}${target}`;
      console.log(`\n▶ Auditing ${label}: ${url}`);

      for (let run = 1; run <= opts.runs; run++) {
        if (opts.runs > 1) console.log(`  Run ${run}/${opts.runs}`);
        const lhr = await runLighthouse(url, chrome);
        const report = formatAuditReport({ label, url, lhr });
        reports.push(report);

        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        const baseName = `${label}-${stamp}${opts.runs > 1 ? `-run${run}` : ""}`;
        fs.writeFileSync(
          path.join(REPORTS_DIR, `${baseName}.json`),
          JSON.stringify(report, null, 2),
        );
        fs.writeFileSync(path.join(REPORTS_DIR, `${baseName}-lhr.json`), JSON.stringify(lhr, null, 2));

        console.log(`  Score: ${report.performanceScorePercent}/100`);
        const lcp = report.metrics.find((m) => m.id === "largest-contentful-paint");
        if (lcp) console.log(`  LCP: ${lcp.value}`);
      }
    }
  } finally {
    await chrome.kill();
    if (serverProcess) serverProcess.kill("SIGTERM");
  }

  const summaryPath = path.join(REPORTS_DIR, "latest-summary.md");
  fs.writeFileSync(summaryPath, writeMarkdownSummary(reports));
  fs.writeFileSync(
    path.join(REPORTS_DIR, "latest-summary.json"),
    JSON.stringify(reports, null, 2),
  );

  console.log(`\n✓ Reports saved to ${REPORTS_DIR}`);
  console.log(`✓ Summary: ${summaryPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
