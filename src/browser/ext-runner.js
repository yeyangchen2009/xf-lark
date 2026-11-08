'use strict';

const { DownloadError } = require('../errors');
const { applyCookies, toLocalStorageItems, AIPOJU_ORIGIN } = require('../storage');
const { NAV_TIMEOUT_MS } = require('./session');

// 飞书文档页有长轮询，networkidle 必然超时白等 30 秒（坑③）；轮询间隔与次数对齐 Python 版
const BUTTON_POLL_ATTEMPTS = 25;
const BUTTON_POLL_INTERVAL_MS = 2_000;
// 坑⑥：close/click 的 CDP 调用在浏览器僵死时会无限挂起，统一给显式超时
const CLOSE_TIMEOUT_MS = 10_000;
const CONTAINER_SELECTOR = '[data-CDC-aipoju-container]';
const BUTTON_SELECTOR = 'button[data-CDC-button-type="download"]';

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DownloadError('已取消'));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DownloadError('已取消'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function abortPromise(signal) {
  return new Promise((_, reject) => {
    if (signal?.aborted) {
      reject(new DownloadError('已取消'));
      return;
    }
    signal.addEventListener('abort', () => reject(new DownloadError('下载已取消')), { once: true });
  });
}

// 扩展/Edge 启动可能自带欢迎页；background.js 第 73-78 行要求窗口恰好 1 个
// 活动标签页（activeTabs.length === 1）才会执行注入，这里先收敛再干活
async function ensureSinglePage(context) {
  let pages = context.pages();
  while (pages.length > 1) {
    const popup = pages[pages.length - 1];
    // 坑⑥：close 的 CDP 调用可能随浏览器僵死而挂起，给超时并补试一次；
    // 仍关不掉就显式失败，杜绝无超时的死等与原地死循环
    try {
      await popup.close({ timeout: CLOSE_TIMEOUT_MS });
    } catch {
      if (popup.isClosed()) break;
      try {
        await popup.close({ timeout: CLOSE_TIMEOUT_MS });
      } catch (error) {
        if (popup.isClosed()) break;
        throw new DownloadError('多余标签页无法关闭，扩展要求的单 tab 环境无法保证');
      }
    }
    pages = context.pages();
  }
  if (!pages.length) return context.newPage();
  return pages[0];
}

// 弹窗兜底：下载流程中任何意外新标签页立即关闭，守住单 tab 约束。
// 导航/下载转换中的标签页首次 close 可能失败，延迟补关一次，失败仍不抛错
function guardSinglePage(context) {
  context.on('page', popup => {
    popup.close().catch(() => {});
    setTimeout(() => {
      if (!popup.isClosed()) popup.close().catch(() => {});
    }, 300);
  });
}

// 注入登录态：cookie 走 addCookies（bulk 失败自动降级逐条），localStorage 进页面上下文写入后 reload
async function bootstrapLogin(context, state) {
  const page = await ensureSinglePage(context);
  await page.goto(`${AIPOJU_ORIGIN}/`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
  const cookieResult = await applyCookies(context, state.cookies);
  const items = toLocalStorageItems(state);
  await page.evaluate(entries => {
    for (const { name, value } of entries) {
      try { window.localStorage.setItem(name, value); } catch { /* 单项写入失败不拖垮整体 */ }
    }
  }, items);
  await page.reload({ waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
  return { page, cookieResult };
}

// 轮询扩展 content script 注入的悬浮容器与下载按钮
async function waitForDownloadButton(page, {
  signal,
  attempts = BUTTON_POLL_ATTEMPTS,
  intervalMs = BUTTON_POLL_INTERVAL_MS,
} = {}) {
  for (let i = 0; i < attempts; i += 1) {
    signal?.throwIfAborted();
    const container = page.locator(CONTAINER_SELECTOR);
    if (await container.count() > 0) {
      const buttons = container.locator(BUTTON_SELECTOR);
      if (await buttons.count() > 0) {
        // 坑②：Playwright Locator 的 .first 是方法不是属性，写 .first 会拿到
        // 原型函数引用，随后 .click() 同步抛 TypeError 且被 finally 的 close 伪装成页面关闭
        return buttons.first();
      }
    }
    await sleep(intervalMs, signal);
  }
  throw new DownloadError('扩展下载按钮在限定时间内未出现（文档无权限、未登录或扩展未生效）');
}

// 先挂 download 监听再点击，与 Python expect_download 同模式；signal 竞速贯通 Ctrl+C
async function triggerDownload(page, button, timeoutMs, signal) {
  const downloadPromise = page.waitForEvent('download', { timeout: timeoutMs });
  // 坑⑥：click 不传 timeout 时沿用 Playwright 默认的无超时动作等待，僵死时会挂住
  await button.click({ timeout: NAV_TIMEOUT_MS });
  try {
    return await Promise.race([downloadPromise, abortPromise(signal)]);
  } catch (error) {
    if (signal?.aborted) throw new DownloadError('下载已取消');
    if (error?.name === 'TimeoutError') {
      throw new DownloadError(
        `等待下载产物超时（${Math.round(timeoutMs / 1000)} 秒），图片密集文档可用 --timeout 加长等待`,
      );
    }
    throw error;
  }
}

// 单篇文档下载主链路；返回 Playwright Download 对象，落盘与校验由 jobs 层在 context 关闭前完成
async function downloadDocx(context, url, { timeoutMs, signal }) {
  // 上一篇下载可能留下 guard 没能关掉的多余标签页（Edge/扩展偶发），
  // 每篇下载前主动收敛回单 tab 自愈，而不是硬失败让整批任务中断
  const page = await ensureSinglePage(context);
  // 坑③：domcontentloaded 即返回，绝不等待 networkidle
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
  const button = await waitForDownloadButton(page, { signal });
  return triggerDownload(page, button, timeoutMs, signal);
}

module.exports = {
  BUTTON_POLL_ATTEMPTS,
  BUTTON_POLL_INTERVAL_MS,
  CLOSE_TIMEOUT_MS,
  CONTAINER_SELECTOR,
  BUTTON_SELECTOR,
  sleep,
  abortPromise,
  ensureSinglePage,
  guardSinglePage,
  bootstrapLogin,
  waitForDownloadButton,
  triggerDownload,
  downloadDocx,
};
