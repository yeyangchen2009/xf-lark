'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { withTempProfile } = require('./browser/session');
const { bootstrapLogin, guardSinglePage, downloadDocx } = require('./browser/ext-runner');
const { loadStorageState } = require('./storage');
const { verifyArtifact } = require('./verify');
const { planListed, planDirect, joinTarget, resolveExt, sanitizeFilename } = require('./utils/filename');
const { parseDocxUrl, loadManifest, filterEntries } = require('./manifest');
const { publicError, redactUrl } = require('./utils/redact');
const { DownloadError, UsageError } = require('./errors');
const { tempRoot: defaultTempRoot } = require('./config');

const REPORT_NAME = 'xf-lark-report.md';

async function writeReport(outputDir, summary) {
  const esc = value => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  const lines = [
    '# xf-lark 下载报告',
    '',
    `- 生成时间: ${new Date().toISOString()}`,
    `- 总数: ${summary.total}`,
    `- 成功: ${summary.succeeded}（含跳过 ${summary.skipped}）`,
    `- 失败: ${summary.failed.length}`,
    summary.interrupted ? '- 状态: 被中断（SIGINT），仅完成部分条目' : '- 状态: 完整跑完',
    '',
  ];
  if (summary.failed.length) {
    lines.push('## 失败列表', '', '| # | 月份 | 名称 | 原因 |', '|---|------|------|------|');
    summary.failed.forEach((item, index) => {
      const reason = publicError(item.reason).slice(0, 200);
      lines.push(`| ${index + 1} | ${esc(item.month)} | ${esc(item.title || redactUrl(item.url))} | ${esc(reason)} |`);
    });
    lines.push('');
  }
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, REPORT_NAME), lines.join('\n'), 'utf8');
}

// 坑⑥：download 事件只代表浏览器开始下载，saveAs 要等整条流结束才落盘；
// 浏览器/CDP 僵死时裸 saveAs 无任何超时会无限挂起（2026-11 实测单条卡 25 分钟）。
// 用 --timeout 同预算做落盘看门狗，超时主动 cancel 让 saveAs reject；SIGINT 联动 cancel
async function saveDownload(download, tmpPath, { timeoutMs, signal }) {
  let timer;
  let onAbort = null;
  const cancelDownload = () => download.cancel().catch(() => {});
  const budget = new Promise((_, reject) => {
    timer = setTimeout(() => {
      cancelDownload();
      reject(new DownloadError(
        `下载落盘超时（${Math.round(timeoutMs / 1000)} 秒），浏览器侧无响应，已取消该条`,
      ));
    }, timeoutMs);
  });
  // abort 必须自己 reject 竞速，否则只 cancel 不动 saveAs 的 fake/僵死 promise，会白等到 budget 超时
  const abort = new Promise((_, reject) => {
    if (!signal) return;
    if (signal.aborted) {
      cancelDownload();
      reject(new DownloadError('下载已取消'));
      return;
    }
    onAbort = () => {
      cancelDownload();
      reject(new DownloadError('下载已取消'));
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });
  try {
    await Promise.race([download.saveAs(tmpPath), budget, abort]);
  } finally {
    clearTimeout(timer);
    if (onAbort) signal.removeEventListener('abort', onAbort);
  }
}

// 单条目：预 skip（清单条目）→ 浏览器下载 → .tmp 落盘 → 校验 → 原子改名
async function runOne(context, entry, options) {
  const { outputDir, timeoutMs, signal, reserved, counters } = options;

  let listedPlan = null;
  if (!entry.direct) {
    listedPlan = planListed({ outputDir, month: entry.month, title: entry.title, reserved });
    if (listedPlan.status === 'skipped') {
      return { status: 'skipped', entry, existing: listedPlan.existing };
    }
  }

  const download = await downloadDocx(context, entry.url, { timeoutMs, signal });
  const suggestedName = download.suggestedFilename();

  let target;
  if (entry.direct) {
    target = planDirect({
      outputDir,
      month: entry.month,
      suggestedName,
      campId: entry.campId,
      stemOverride: entry.outputStem,
      reserved,
    }).target;
  } else {
    target = joinTarget({
      outputDir,
      directory: listedPlan.directory,
      stem: listedPlan.stem,
      ext: resolveExt(suggestedName),
    });
    reserved.add(target);
  }

  // 先写 .tmp 再校验后 rename：坏文件不会占用正式文件名，避免 Python 版坏文件被永久 SKIP
  const ext = path.extname(target);
  const tmpPath = path.join(path.dirname(target), `.tmp-${process.pid}-${counters.tmp++}${ext}`);
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await saveDownload(download, tmpPath, { timeoutMs, signal });
    const verifyResult = await verifyArtifact(tmpPath);
    await fs.rename(tmpPath, target);
    return {
      status: 'ok',
      entry,
      target,
      size: verifyResult.size,
      zipEntries: verifyResult.entries,
    };
  } catch (error) {
    await fs.rm(tmpPath, { force: true }).catch(() => {});
    throw error;
  }
}

// 串行跑一批条目，单项失败记录后继续；deps 可注入便于单测
async function runEntries(entries, options, deps = {}) {
  const withProfile = deps.withProfile || withTempProfile;
  const loadState = deps.loadState || loadStorageState;
  const reserved = new Set();
  const runOptions = { ...options, reserved, counters: { tmp: 0 } };
  const results = [];
  const failed = [];
  let skipped = 0;
  let interrupted = false;

  const state = await loadState(options.storagePath);

  try {
    await withProfile(async context => {
      guardSinglePage(context);
      const { cookieResult } = await bootstrapLogin(context, state);
      if (cookieResult.failed > 0) {
        process.stdout.write(`提示: ${cookieResult.failed} 个 cookie 注入失败，已继续（localStorage 可能足以登录）\n`);
      }
      for (let index = 0; index < entries.length; index += 1) {
        const entry = entries[index];
        if (options.signal.aborted) throw new DownloadError('已取消');
        const label = entry.title || redactUrl(entry.url);
        process.stdout.write(`[${index + 1}/${entries.length}] ${entry.month} - ${label}\n`);
        try {
          const result = await runOne(context, entry, runOptions);
          results.push(result);
          if (result.status === 'skipped') {
            skipped += 1;
            process.stdout.write(`      SKIP（已存在 ${path.basename(result.existing)}）\n`);
          } else {
            const detail = result.zipEntries ? `，${result.zipEntries} 个 ZIP 条目` : '';
            process.stdout.write(`      OK → ${path.basename(result.target)}（${(result.size / 1024 / 1024).toFixed(2)}MB${detail}）\n`);
          }
        } catch (error) {
          failed.push({ ...entry, reason: publicError(error) });
          results.push({ status: 'failed', entry });
          process.stdout.write(`      FAIL: ${publicError(error)}\n`);
        }
      }
    }, {
      edge: options.edge,
      tempRoot: options.tempRoot || defaultTempRoot(),
      signal: options.signal,
    });
  } catch (error) {
    if (!options.signal.aborted) throw error;
    interrupted = true;
  }

  const succeeded = results.filter(result => result.status === 'ok' || result.status === 'skipped').length;
  const summary = { total: entries.length, succeeded, skipped, failed, interrupted, results };
  await writeReport(options.outputDir, summary);
  if (interrupted) throw new DownloadError('任务被中断，已完成部分的报告已写入');
  return summary;
}

async function runGet(urls, options, deps) {
  if (!urls.length) throw new UsageError('get 至少需要一个 docx 链接');
  if (options.output && urls.length > 1) throw new UsageError('-o 仅支持单个链接');
  const month = options.month ? String(options.month).replace(/-/g, '') : 'direct';
  const entries = urls.map(url => {
    const parsed = parseDocxUrl(url);
    return {
      month,
      title: options.output ? sanitizeFilename(options.output) : '',
      count: null,
      url: parsed.url,
      campId: parsed.campId,
      token: parsed.token,
      direct: true,
      outputStem: options.output || null,
    };
  });
  return runEntries(entries, options, deps);
}

async function runBatch(manifestPath, options, deps) {
  const entries = await loadManifest(manifestPath);
  const filtered = filterEntries(entries, {
    month: options.month ? String(options.month).replace(/-/g, '') : null,
    offset: options.offset || 0,
    limit: options.limit === undefined || options.limit === null ? null : options.limit,
  });
  if (!filtered.length) throw new UsageError('过滤后没有可下载的条目');
  return runEntries(filtered, options, deps);
}

module.exports = {
  REPORT_NAME,
  writeReport,
  saveDownload,
  runOne,
  runEntries,
  runGet,
  runBatch,
};
