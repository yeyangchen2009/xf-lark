'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { extensionPath } = require('./config');
const { withTempProfile, waitForServiceWorker } = require('./browser/session');
const { loadStorageState, summarizeState } = require('./storage');

const PINNED_EXT_VERSION = '1.11.0';
const PINNED_EXT_FILES = 27;

async function checkNodeVersion() {
  const major = Number(process.versions.node.split('.')[0]);
  return {
    name: 'Node 运行时版本',
    ok: major >= 22,
    detail: `当前 Node ${process.versions.node}，要求 >= 22`,
  };
}

async function checkExtensionAssets() {
  const distDir = extensionPath();
  try {
    const entries = await fs.readdir(distDir, { recursive: true, withFileTypes: true });
    const files = entries.filter(entry => entry.isFile());
    const manifest = JSON.parse(await fs.readFile(path.join(distDir, 'manifest.json'), 'utf8'));
    const versionOk = manifest.version === PINNED_EXT_VERSION;
    const countOk = files.length === PINNED_EXT_FILES;
    return {
      name: '包内扩展资产',
      ok: versionOk && countOk,
      detail: `version=${manifest.version}（期望 ${PINNED_EXT_VERSION}），文件 ${files.length} 个（期望 ${PINNED_EXT_FILES}）`,
    };
  } catch (error) {
    return { name: '包内扩展资产', ok: false, detail: `扩展资产缺失或损坏: ${error.message}` };
  }
}

async function checkWritable(dir, label) {
  await fs.mkdir(dir, { recursive: true });
  const probe = path.join(dir, `.write-probe-${process.pid}`);
  try {
    await fs.writeFile(probe, 'ok');
    await fs.rm(probe, { force: true });
    return { name: `${label}可写`, ok: true, detail: dir };
  } catch (error) {
    return { name: `${label}可写`, ok: false, detail: `${dir}: ${error.message}` };
  }
}

//  headed 启动临时 profile，等到 MV3 background service worker 注册即证明扩展被浏览器加载
async function checkExtensionLoad({ edge, tempRootDir, signal }) {
  try {
    await withTempProfile(async context => {
      const worker = await waitForServiceWorker(context);
      if (!worker.url().startsWith('chrome-extension://')) {
        throw new Error(`service worker 不是扩展页面: ${worker.url()}`);
      }
    }, { edge, tempRoot: tempRootDir, signal });
    return {
      name: '有头 Edge 加载扩展',
      ok: true,
      detail: '临时 profile 启动并确认扩展 service worker 已注册',
    };
  } catch (error) {
    return { name: '有头 Edge 加载扩展', ok: false, detail: error.message };
  }
}

async function checkStorage(storagePath) {
  try {
    const state = await loadStorageState(storagePath);
    const summary = summarizeState(state);
    const expiry = summary.earliestExpiry
      ? new Date(summary.earliestExpiry * 1000).toISOString().slice(0, 10)
      : '无显式过期';
    return {
      level: 'warning',
      detail: `登录态可用：cookie ${summary.cookieCount} 个、localStorage 键 ${summary.storageKeys.length} 个、最早过期 ${expiry}（${storagePath}）`,
    };
  } catch (error) {
    return { level: 'warning', detail: `未发现可用登录态（不影响 doctor 结论）：${error.message}` };
  }
}

async function runDoctor({ edge, dataHomeDir, outputDir, storagePath, tempRootDir, signal }) {
  const checks = await Promise.all([
    checkNodeVersion(),
    checkExtensionAssets(),
    checkWritable(dataHomeDir, '数据目录'),
    checkWritable(outputDir, '输出目录'),
  ]);
  checks.push(await checkExtensionLoad({ edge, tempRootDir, signal }));
  const warnings = [await checkStorage(storagePath)];
  return { ok: checks.every(check => check.ok), checks, warnings };
}

module.exports = { runDoctor, PINNED_EXT_VERSION, PINNED_EXT_FILES };
