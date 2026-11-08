'use strict';

// 真实浏览器门禁：npm test 时全部 skip，仅 npm run test:edge 执行；自动化永不访问真实 aipoju
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { withTempProfile, launchContext, waitForServiceWorker } = require('../src/browser/session');
const { waitForDownloadButton, triggerDownload } = require('../src/browser/ext-runner');
const { verifyArtifact } = require('../src/verify');
const {
  normalizeStorageState,
  saveStorageState,
  loadStorageState,
  AIPOJU_ORIGIN,
} = require('../src/storage');

const TEMP_ROOT = 'F:\\temp\\xf-lark-tests';
const edgeOnly = {
  skip: process.env.npm_lifecycle_event === 'test:edge' ? false : '仅通过 npm run test:edge 独立运行',
  timeout: 120_000,
};

async function makeTempDir(t, prefix) {
  await fsp.mkdir(TEMP_ROOT, { recursive: true });
  const directory = await fsp.mkdtemp(path.join(TEMP_ROOT, prefix));
  t.after(() => fsp.rm(directory, { recursive: true, force: true }));
  return directory;
}

// 页面延迟 1.2 秒仿造扩展容器与下载按钮，点击后用 anchor[download] 抛一个 Markdown 下载
const BUTTON_PAGE = `<!doctype html><meta charset="utf-8"><body>
<script>
setTimeout(() => {
  const box = document.createElement('div');
  box.setAttribute('data-CDC-aipoju-container', '');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('data-CDC-button-type', 'download');
  btn.addEventListener('click', () => {
    const blob = new Blob(['# fake markdown\\n\\nbody line\\n'], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fake-doc.md';
    a.click();
  });
  box.appendChild(btn);
  document.body.appendChild(box);
}, 1200);
</script>`;

const STATE_PAGE = `<!doctype html><meta charset="utf-8"><body>
<script>window.localStorage.setItem('token', 'fake-token-value');</script>`;

async function startServer(t, handler) {
  const server = http.createServer(handler);
  const sockets = new Set();
  server.on('connection', socket => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(async () => {
    for (const socket of sockets) socket.destroy();
    if (server.listening) {
      await new Promise((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
      });
    }
  });
  return `http://127.0.0.1:${server.address().port}`;
}

test('有头 Edge 加载 vendor 扩展并等到 service worker 注册', edgeOnly, async t => {
  const directory = await makeTempDir(t, 'edge-sw-');
  await withTempProfile(async context => {
    const worker = await waitForServiceWorker(context);
    assert.ok(worker.url().startsWith('chrome-extension://'));
  }, { tempRoot: directory });
});

test('本地仿造按钮走通轮询、下载竞速、saveAs 与产物校验全链路', edgeOnly, async t => {
  const directory = await makeTempDir(t, 'edge-flow-');
  const baseUrl = await startServer(t, (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(BUTTON_PAGE);
  });
  const savePath = path.join(directory, 'fake-doc.md');

  await withTempProfile(async context => {
    const page = context.pages()[0] || await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    // 轮询参数收紧，验证延迟挂载的容器能被发现
    const button = await waitForDownloadButton(page, { attempts: 15, intervalMs: 200 });
    const download = await triggerDownload(page, button, 15_000);
    assert.equal(download.suggestedFilename(), 'fake-doc.md');
    await download.saveAs(savePath);
  }, { tempRoot: directory });

  const result = await verifyArtifact(savePath);
  assert.equal(result.ext, '.md');
  assert.ok(result.size > 0);
});

test('cookie 与 localStorage 的 storageState 落盘往返，legacy/localStorage 三态可归一', edgeOnly, async t => {
  const directory = await makeTempDir(t, 'edge-state-');
  const profileDir = path.join(directory, 'profile');
  const baseUrl = await startServer(t, (req, res) => {
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'set-cookie': 'fake-cookie=abc123; Path=/',
    });
    res.end(STATE_PAGE);
  });
  const storagePath = path.join(directory, 'storage.json');

  const context = await launchContext({ persistentDir: profileDir, withExtension: false });
  try {
    const page = context.pages()[0] || await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.localStorage.getItem('token') === 'fake-token-value');
    const state = normalizeStorageState(await context.storageState());
    assert.ok(state.cookies.some(c => c.name === 'fake-cookie'));
    // normalize 统一把 localStorage 归到 aipoju origin（legacy 扁平格式同口径）
    const origin = state.origins.find(o => o.origin === AIPOJU_ORIGIN);
    assert.ok(origin.localStorage.some(item => item.name === 'token' && item.value === 'fake-token-value'));
    await saveStorageState(storagePath, state);
  } finally {
    await context.close().catch(() => {});
  }

  const loaded = await loadStorageState(storagePath);
  const reloaded = normalizeStorageState({
    cookies: loaded.cookies,
    localStorage: Object.fromEntries(
      loaded.origins.flatMap(o => o.localStorage.map(item => [item.name, item.value])),
    ),
  });
  assert.equal(reloaded.cookies.length, loaded.cookies.length);
  assert.ok(reloaded.origins[0].localStorage.some(item => item.name === 'token'));
});
