'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');
const { extensionPath, tempRoot } = require('../config');
const { DownloadError } = require('../errors');
const {
  normalizeStorageState,
  saveStorageState,
  summarizeState,
} = require('../storage');
const { AIPOJU_ORIGIN } = require('../storage');

const NAV_TIMEOUT_MS = 30_000;
const SW_WAIT_MS = 15_000;
// 坑⑥：收尾关浏览器也要有界，CDP 僵死时不能让 finally 把整个进程挂住
const CLOSE_TIMEOUT_MS = 10_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// MV3 service worker 懒加载：扩展安装的 onInstalled 唤醒早于本函数注册监听器，
// waitForEvent 会永久错过；必须先查存量再竞速事件与轮询
async function waitForServiceWorker(context, timeoutMs = SW_WAIT_MS) {
  const existing = context.serviceWorkers();
  if (existing.length) return existing[0];
  const viaEvent = context.waitForEvent('serviceworker', { timeout: timeoutMs });
  const viaPoll = (async () => {
    while (true) {
      await sleep(250);
      const found = context.serviceWorkers()[0];
      if (found) return found;
    }
  })();
  return Promise.race([viaEvent, viaPoll]);
}

// 统一启动入口。坑①：launchPersistentContext 是异步 API，调用方必须 await，
// 漏 await 会拿到 Promise，后续 context.* 全部 not a function，finally 的 close
// 还会把错误伪装成 "Target page, context or browser has been closed"。
async function launchContext({ persistentDir, withExtension, edge, downloadsDir, signal }) {
  const extPath = extensionPath();
  const launchOptions = {
    headless: false, // 有头是硬约束：扩展注入与下载事件均未在 headless 验证
    acceptDownloads: true,
    viewport: { width: 1920, height: 1080 },
    timeout: NAV_TIMEOUT_MS,
    args: withExtension ? [
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
    ] : [],
  };
  if (downloadsDir) launchOptions.downloadsPath = downloadsDir;
  if (edge) {
    launchOptions.executablePath = edge;
  } else {
    launchOptions.channel = 'msedge';
  }
  if (signal) launchOptions.signal = signal;

  const context = await chromium.launchPersistentContext(persistentDir, launchOptions);
  return context;
}

// 新鲜临时 profile 是两条硬约束的共同前提：
//   ① background.js 73-78 行要求窗口恰好 1 个活动标签页才注入转换脚本；
//   ② 扩展默认 legacyFileSave 下载方式，用户若在老 profile 改过 ShowSaveFilePicker，
//      Playwright 收不到 download 事件。mkdtemp 保证每次都是干净单页与默认设置。
async function withTempProfile(run, options = {}) {
  const root = options.tempRoot || tempRoot();
  await fs.mkdir(root, { recursive: true });
  const profileDir = await fs.mkdtemp(path.join(root, 'xfl-profile-'));
  let context;
  try {
    context = await launchContext({
      persistentDir: profileDir,
      withExtension: true,
      edge: options.edge,
      downloadsDir: options.downloadsDir,
      signal: options.signal,
    });
    return await run(context);
  } finally {
    if (context) await context.close({ timeout: CLOSE_TIMEOUT_MS }).catch(() => {});
    await fs.rm(profileDir, { recursive: true, force: true }).catch(() => {});
  }
}

function waitForEnter(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DownloadError('登录已取消'));
      return;
    }
    const cleanup = () => {
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
      process.stdin.removeListener('end', onEnd);
      signal?.removeEventListener('abort', onAbort);
    };
    const onData = () => { cleanup(); resolve(); };
    const onEnd = () => { cleanup(); reject(new DownloadError('stdin 已关闭，无法等待登录确认')); };
    const onAbort = () => { cleanup(); reject(new DownloadError('登录已取消')); };
    process.stdin.resume();
    process.stdin.once('data', onData);
    process.stdin.once('end', onEnd);
    signal?.addEventListener('abort', onAbort);
  });
}

// login 不加载扩展、不约束 tab；持久 profile 保留用户数据，storageState 落盘 0600
async function login({ edge, profileDir, storagePath, signal }) {
  await fs.mkdir(profileDir, { recursive: true, mode: 0o700 });
  const context = await launchContext({ persistentDir: profileDir, withExtension: false, edge, signal });
  try {
    const closed = new Promise((_, reject) => {
      context.once('close', () => reject(new DownloadError('浏览器被关闭，登录态未保存，请重新登录')));
    });
    const page = context.pages()[0] || await context.newPage();
    await page.goto(`${AIPOJU_ORIGIN}/`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });

    process.stdout.write('请在弹出的 Edge 中手动完成登录，然后回到终端按 Enter 保存登录态…\n');
    await Promise.race([waitForEnter(signal), closed]);

    const state = await context.storageState();
    const normalized = normalizeStorageState(state);
    await saveStorageState(storagePath, normalized);
    return summarizeState(normalized);
  } finally {
    await context.close({ timeout: CLOSE_TIMEOUT_MS }).catch(() => {});
  }
}

module.exports = {
  NAV_TIMEOUT_MS,
  SW_WAIT_MS,
  CLOSE_TIMEOUT_MS,
  sleep,
  waitForServiceWorker,
  launchContext,
  withTempProfile,
  waitForEnter,
  login,
};
