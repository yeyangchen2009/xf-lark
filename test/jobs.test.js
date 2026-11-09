'use strict';

const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const Module = require('node:module');
const { UsageError, DownloadError } = require('../src/errors');
const { AIPOJU_ORIGIN } = require('../src/storage');

const TEMP_ROOT = 'F:/temp/xf-lark-tests';
let tempDir;

const behavior = { downloadDocx: null };
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  // 与 xf-video 同惯例：桩掉 playwright-core，保证 npm install 前也能跑纯逻辑测试
  if (request === 'playwright-core') return { chromium: {} };
  if (parent?.filename?.endsWith(path.join('src', 'jobs.js')) && request === './browser/ext-runner') {
    return {
      guardSinglePage: () => {},
      bootstrapLogin: async () => ({ page: {}, cookieResult: { applied: 0, failed: 0, errors: [] } }),
      downloadDocx: (...args) => behavior.downloadDocx(...args),
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const jobs = require('../src/jobs');
const { REPORT_NAME } = jobs;

function makeFakeDownload(name, content) {
  return {
    suggestedFilename: () => name,
    saveAs: async target => fs.writeFile(target, content),
  };
}

const fakeState = {
  cookies: [],
  origins: [{ origin: AIPOJU_ORIGIN, localStorage: [{ name: 'token', value: 'fake-token' }] }],
};
const deps = {
  withProfile: async callback => callback({}),
  loadState: async () => fakeState,
};

function baseOptions(overrides = {}) {
  const controller = new AbortController();
  return {
    outputDir: path.join(tempDir, 'out'),
    timeoutMs: 5_000,
    signal: controller.signal,
    storagePath: path.join(tempDir, 'storage.json'),
    edge: undefined,
    ...overrides,
  };
}

const directEntry = {
  month: 'direct',
  title: '',
  url: 'https://aipoju.com/docx/camp1/token1',
  campId: 'camp1',
  token: 'token1',
  direct: true,
};

before(async () => {
  await fs.mkdir(TEMP_ROOT, { recursive: true });
  tempDir = await fs.mkdtemp(path.join(TEMP_ROOT, 'jobs-'));
});

after(async () => {
  Module._load = originalLoad;
  await fs.rm(tempDir, { recursive: true, force: true });
});

beforeEach(() => {
  behavior.downloadDocx = async () => makeFakeDownload('fake-doc.md', '# heading\n\nbody\n');
});

test('runEntries: direct 条目成功落盘并写报告', async () => {
  const options = baseOptions();
  const summary = await jobs.runEntries([directEntry], options, deps);
  assert.equal(summary.failed.length, 0);
  assert.equal(summary.succeeded, 1);
  const artifact = path.join(options.outputDir, 'direct', 'fake-doc.md');
  await assert.doesNotReject(fs.access(artifact));
  const report = await fs.readFile(path.join(options.outputDir, REPORT_NAME), 'utf8');
  assert.match(report, /总数: 1/);
  assert.match(report, /状态: 完整跑完/);
});

test('runEntries: 清单条目命中同名 .md 即 SKIP，不调用浏览器下载', async () => {
  const options = baseOptions();
  const monthDir = path.join(options.outputDir, '202609');
  await fs.mkdir(monthDir, { recursive: true });
  await fs.writeFile(path.join(monthDir, '手册A.md'), 'existing');
  let calls = 0;
  behavior.downloadDocx = async () => { calls += 1; };

  const summary = await jobs.runEntries([{
    month: '202609',
    title: '手册A',
    count: 1,
    url: 'https://aipoju.com/docx/camp2/token2',
    campId: 'camp2',
    token: 'token2',
    direct: false,
  }], options, deps);

  assert.equal(calls, 0);
  assert.equal(summary.skipped, 1);
  assert.equal(summary.succeeded, 1);
});

test('runEntries: 校验失败时清理 .tmp、记失败并继续，报告含失败表', async () => {
  const options = baseOptions();
  behavior.downloadDocx = async () => makeFakeDownload('broken.zip', 'not-a-real-zip');
  const summary = await jobs.runEntries([directEntry], options, deps);

  assert.equal(summary.failed.length, 1);
  assert.equal(summary.succeeded, 0);
  const entries = await fs.readdir(path.join(options.outputDir, 'direct'));
  assert.ok(!entries.some(name => name.startsWith('.tmp-')), '临时文件必须清理');
  assert.ok(!entries.includes('broken.zip'), '坏文件不能占用正式文件名');
  const report = await fs.readFile(path.join(options.outputDir, REPORT_NAME), 'utf8');
  assert.match(report, /失败列表/);
  assert.match(report, /ZIP/);
  // 能力 URL 的 camp/token 不得进报告，必须整体脱敏
  assert.doesNotMatch(report, /camp1\/token1/);
  assert.match(report, /REDACTED/);
});

test('runEntries: SIGINT 中断后仍写报告并抛中断错误', async () => {
  const controller = new AbortController();
  const options = baseOptions({ signal: controller.signal });
  controller.abort();
  await assert.rejects(jobs.runEntries([directEntry], options, deps), DownloadError);
  const report = await fs.readFile(path.join(options.outputDir, REPORT_NAME), 'utf8');
  assert.match(report, /被中断/);
});

test('runGet: 参数校验与 -o 自定义词干落盘', async () => {
  await assert.rejects(jobs.runGet([], baseOptions(), deps), UsageError);
  await assert.rejects(
    jobs.runGet([
      'https://aipoju.com/docx/c1/t1',
      'https://aipoju.com/docx/c2/t2',
    ], baseOptions({ output: 'stem' }), deps),
    UsageError,
  );

  const options = baseOptions({ output: '自定义名字', month: '2026-09' });
  const summary = await jobs.runGet(['https://aipoju.com/docx/c1/t1'], options, deps);
  assert.equal(summary.failed.length, 0);
  await assert.doesNotReject(fs.access(path.join(options.outputDir, '202609', '自定义名字.md')));
});

test('runBatch: JSON 清单经 limit 过滤后串行执行', async () => {
  const manifestPath = path.join(tempDir, 'jobs.json');
  await fs.writeFile(manifestPath, JSON.stringify([
    { url: 'https://aipoju.com/docx/c1/t1', name: '手册一', month: '202610' },
    { url: 'https://aipoju.com/docx/c2/t2', name: '手册二', month: '202610' },
  ]));
  const options = baseOptions({ limit: 1 });
  const summary = await jobs.runBatch(manifestPath, options, deps);
  assert.equal(summary.total, 1);
  assert.equal(summary.succeeded, 1);
  // 缺陷 C：带 name 的 JSON 条目走清单语义，产物按 title 命名而非 suggestedFilename
  await assert.doesNotReject(fs.access(path.join(options.outputDir, '202610', '手册一.md')));
});

test('runBatch: JSON 带 name 条目命中同名文件即 SKIP（缺陷 C 回归）', async () => {
  const manifestPath = path.join(tempDir, 'jobs-skip.json');
  await fs.writeFile(manifestPath, JSON.stringify([
    { url: 'https://aipoju.com/docx/c1/t1', name: '已下载手册', month: '202610' },
  ]));
  const monthDir = path.join(baseOptions().outputDir, '202610');
  await fs.mkdir(monthDir, { recursive: true });
  await fs.writeFile(path.join(monthDir, '已下载手册.zip'), 'existing');
  let calls = 0;
  behavior.downloadDocx = async () => { calls += 1; };

  const summary = await jobs.runBatch(manifestPath, baseOptions(), deps);
  assert.equal(calls, 0, '命中 SKIP 不得触发浏览器下载');
  assert.equal(summary.skipped, 1);
  assert.equal(summary.succeeded, 1);
});

test('saveDownload: 落盘看门狗超时后 cancel 并抛 DownloadError（坑⑥）', async () => {
  const calls = { cancel: 0 };
  const stuck = {
    saveAs: () => new Promise(() => {}), // 模拟浏览器僵死，永不落盘
    cancel: async () => { calls.cancel += 1; },
  };
  await assert.rejects(
    jobs.saveDownload(stuck, path.join(tempDir, 'stuck.zip'), {
      timeoutMs: 50,
      signal: baseOptions().signal,
    }),
    DownloadError,
  );
  assert.equal(calls.cancel, 1, '超时必须主动 cancel 浏览器下载');
});

test('saveDownload: signal 中断时 cancel 下载并抛错（坑⑥）', async () => {
  const controller = new AbortController();
  const calls = { cancel: 0 };
  const stuck = {
    saveAs: () => new Promise(() => {}),
    cancel: async () => { calls.cancel += 1; },
  };
  const promise = jobs.saveDownload(stuck, path.join(tempDir, 'aborted.zip'), {
    timeoutMs: 5_000,
    signal: controller.signal,
  });
  controller.abort();
  await assert.rejects(promise, DownloadError);
  assert.equal(calls.cancel, 1);
});

test('saveDownload: 正常落盘后清理看门狗，不触发 cancel（坑⑥）', async () => {
  const calls = { cancel: 0 };
  const target = path.join(tempDir, 'fine.zip');
  const ok = {
    saveAs: async t => fs.writeFile(t, 'PK'),
    cancel: async () => { calls.cancel += 1; },
  };
  await jobs.saveDownload(ok, target, { timeoutMs: 300, signal: baseOptions().signal });
  await assert.doesNotReject(fs.access(target));
  assert.equal(calls.cancel, 0);
  // 等过看门狗预算，确认 timer 已清理、没有迟到的 cancel
  await new Promise(resolve => setTimeout(resolve, 400));
  assert.equal(calls.cancel, 0);
});

test('runBatch: 过滤结果为空时报 UsageError', async () => {
  const manifestPath = path.join(tempDir, 'empty.json');
  await fs.writeFile(manifestPath, JSON.stringify([
    { url: 'https://aipoju.com/docx/c1/t1', name: '手册一', month: '202610' },
  ]));
  await assert.rejects(
    jobs.runBatch(manifestPath, baseOptions({ month: '202501' }), deps),
    UsageError,
  );
});
