'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {
  PROFILE_PREFIX,
  STALE_PROFILE_MS,
  listStaleProfiles,
  cleanupStaleProfiles,
} = require('../src/browser/session');

const TEMP_ROOT = 'F:/temp/xf-lark-tests';
let tempDir;
// 固定时钟，避免依赖真实当前时间；目录 mtime 相对它构造
const NOW = Date.parse('2026-11-09T00:00:00.000Z');
const HOUR = 60 * 60 * 1000;

before(async () => {
  await fs.mkdir(TEMP_ROOT, { recursive: true });
  tempDir = await fs.mkdtemp(path.join(TEMP_ROOT, 'session-'));
});

after(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

// 在 root 下建一个目录并把 mtime 调到指定偏移
async function mkdirAged(root, name, ageMs) {
  const dir = path.join(root, name);
  await fs.mkdir(dir, { recursive: true });
  await fs.utimes(dir, new Date(NOW), new Date(NOW - ageMs));
  return dir;
}

test('listStaleProfiles 在 root 不存在时返回空数组且不抛错', async () => {
  const result = await listStaleProfiles(path.join(tempDir, 'no-such-root'), { now: NOW });
  assert.deepEqual(result, []);
});

test('listStaleProfiles 只列出超过陈旧阈值的同前缀目录', async () => {
  const root = await fs.mkdtemp(path.join(tempDir, 'list-'));
  const stale = await mkdirAged(root, `${PROFILE_PREFIX}stale`, 2 * HOUR);
  await mkdirAged(root, `${PROFILE_PREFIX}fresh`, 5 * 60 * 1000);
  // 同前缀但是文件，不是目录，必须被忽略
  const file = path.join(root, `${PROFILE_PREFIX}afile`);
  await fs.writeFile(file, 'x');
  await fs.utimes(file, new Date(NOW), new Date(NOW - 2 * HOUR));
  // 不带前缀的无关目录，即使很旧也不能动
  await mkdirAged(root, 'unrelated-dir', 2 * HOUR);

  const found = await listStaleProfiles(root, { now: NOW });
  assert.deepEqual(found, [stale]);
});

test('陈旧度恰好等于阈值也清理（mtime 差 >= staleMs 边界）', async () => {
  const root = await fs.mkdtemp(path.join(tempDir, 'edge-'));
  const onEdge = await mkdirAged(root, `${PROFILE_PREFIX}on-edge`, STALE_PROFILE_MS);
  const found = await listStaleProfiles(root, { now: NOW, staleMs: STALE_PROFILE_MS });
  assert.deepEqual(found, [onEdge]);
});

test('cleanupStaleProfiles 删除陈旧目录、保留新目录与无关文件，并返回删除清单', async () => {
  const root = await fs.mkdtemp(path.join(tempDir, 'clean-'));
  const stale = await mkdirAged(root, `${PROFILE_PREFIX}stale`, 2 * HOUR);
  const fresh = await mkdirAged(root, `${PROFILE_PREFIX}fresh`, 5 * 60 * 1000);
  const unrelated = await mkdirAged(root, 'unrelated-dir', 2 * HOUR);
  const keepFile = path.join(root, 'note.txt');
  await fs.writeFile(keepFile, 'keep');

  const removed = await cleanupStaleProfiles(root, { now: NOW });

  assert.deepEqual(removed, [stale]);
  await assert.rejects(fs.stat(stale), { code: 'ENOENT' });
  assert.ok(await fs.stat(fresh));
  assert.ok(await fs.stat(unrelated));
  assert.ok(await fs.stat(keepFile));
});
