'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {
  AIPOJU_ORIGIN,
  sanitizeCookie,
  normalizeStorageState,
  loadStorageState,
  saveStorageState,
  applyCookies,
  toLocalStorageItems,
  summarizeState,
} = require('../src/storage');
const { UsageError } = require('../src/errors');

const TEMP_ROOT = 'F:/temp/xf-lark-tests';
let tempDir;

before(async () => {
  await fs.mkdir(TEMP_ROOT, { recursive: true });
  tempDir = await fs.mkdtemp(path.join(TEMP_ROOT, 'storage-'));
});

after(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

test('sanitizeCookie 剔除残缺与过期项，补 sameSite，None 强制 secure', () => {
  assert.equal(sanitizeCookie(null), null);
  assert.equal(sanitizeCookie({ name: 'a' }), null);
  assert.equal(sanitizeCookie({ name: 'a', domain: 'aipoju.com' }), null);
  const expired = { name: 'a', domain: 'aipoju.com', path: '/', value: 'v', expires: 1 };
  assert.equal(sanitizeCookie(expired, 2_000_000_000), null);

  const lax = sanitizeCookie({ name: 'a', domain: 'aipoju.com', path: '/', value: 'v' });
  assert.equal(lax.sameSite, 'Lax');
  assert.equal(lax.value, 'v');

  const none = sanitizeCookie({
    name: 'a', domain: 'aipoju.com', path: '/', value: 'v', sameSite: 'None', secure: false,
  });
  assert.equal(none.sameSite, 'None');
  assert.equal(none.secure, true);

  const badSameSite = sanitizeCookie({
    name: 'a', domain: 'aipoju.com', path: '/', value: 'v', sameSite: 'Weird',
  });
  assert.equal(badSameSite.sameSite, 'Lax');
});

test('normalizeStorageState 兼容 native 完整形态', () => {
  const state = normalizeStorageState({
    cookies: [{ name: 'c1', domain: 'aipoju.com', path: '/', value: 'v1' }],
    origins: [{ origin: AIPOJU_ORIGIN, localStorage: [{ name: 'token', value: 'abc' }] }],
  });
  assert.equal(state.cookies.length, 1);
  assert.equal(state.cookies[0].sameSite, 'Lax');
  assert.deepEqual(state.origins, [{
    origin: AIPOJU_ORIGIN,
    localStorage: [{ name: 'token', value: 'abc' }],
  }]);
});

test('normalizeStorageState 兼容 Python legacy：仅 localStorage 无 cookies 键', () => {
  const state = normalizeStorageState({ localStorage: { token: 'abc', userNumber: '42' } });
  assert.deepEqual(state.cookies, []);
  const items = toLocalStorageItems(state);
  assert.deepEqual(items, [
    { name: 'token', value: 'abc' },
    { name: 'userNumber', value: '42' },
  ]);
});

test('normalizeStorageState 兼容仅 cookies 形态', () => {
  const state = normalizeStorageState({
    cookies: [{ name: 'c1', domain: 'aipoju.com', path: '/', value: 'v1' }],
  });
  assert.equal(state.cookies.length, 1);
  assert.deepEqual(toLocalStorageItems(state), []);
});

test('normalizeStorageState origins 与 legacy localStorage 并存时以 origins 为准', () => {
  const state = normalizeStorageState({
    cookies: [],
    origins: [{ origin: AIPOJU_ORIGIN, localStorage: [{ name: 'k1', value: 'native' }] }],
    localStorage: { k1: 'legacy', k2: 'legacy2' },
  });
  assert.deepEqual(toLocalStorageItems(state), [{ name: 'k1', value: 'native' }]);
});

test('normalizeStorageState 拒绝空态与坏结构', () => {
  assert.throws(() => normalizeStorageState({}), UsageError);
  assert.throws(() => normalizeStorageState({ cookies: [], localStorage: {} }), UsageError);
  assert.throws(() => normalizeStorageState(null), UsageError);
  assert.throws(() => normalizeStorageState([]), UsageError);
  assert.throws(() => normalizeStorageState({ cookies: 'nope' }), UsageError);
  assert.throws(() => normalizeStorageState({ origins: 'nope' }), UsageError);
  assert.throws(
    () => normalizeStorageState({ origins: [{ origin: AIPOJU_ORIGIN }] }),
    UsageError,
  );
  assert.throws(() => normalizeStorageState({ localStorage: [] }), UsageError);
});

test('save/loadStorageState 往返一致，login 只写 native 格式', async () => {
  const file = path.join(tempDir, 'profiles', 'default', 'storage.json');
  const state = normalizeStorageState({
    cookies: [{ name: 'c1', domain: 'aipoju.com', path: '/', value: 'v1' }],
    origins: [{ origin: AIPOJU_ORIGIN, localStorage: [{ name: 'token', value: 'abc' }] }],
  });
  await saveStorageState(file, state);
  const loaded = await loadStorageState(file);
  assert.deepEqual(loaded, state);

  const raw = JSON.parse(await fs.readFile(file, 'utf8'));
  assert.ok(Array.isArray(raw.origins) && !('localStorage' in raw));
});

test('loadStorageState 读取 legacy 文件并归一', async () => {
  const file = path.join(tempDir, 'legacy.json');
  await fs.writeFile(file, JSON.stringify({ localStorage: { token: 'abc' } }));
  const loaded = await loadStorageState(file);
  assert.equal(loaded.cookies.length, 0);
  assert.equal(toLocalStorageItems(loaded)[0].name, 'token');
});

test('loadStorageState 坏文件给 UsageError', async () => {
  const badJson = path.join(tempDir, 'bad.json');
  await fs.writeFile(badJson, '{not json');
  await assert.rejects(() => loadStorageState(badJson), UsageError);
  await assert.rejects(() => loadStorageState(path.join(tempDir, 'missing.json')), UsageError);
});

test('applyCookies bulk 成功直接返回；bulk 失败降级逐条并统计', async () => {
  const okContext = { addCookies: async () => undefined };
  const ok = await applyCookies(okContext, [
    { name: 'a' }, { name: 'b' },
  ]);
  assert.deepEqual(ok, { applied: 2, failed: 0, errors: [] });

  let call = 0;
  const flakyContext = {
    addCookies: async cookies => {
      call += 1;
      if (call === 1) throw new Error('bulk rejected');
      if (cookies[0].name === 'bad') throw new Error('bad cookie');
    },
  };
  const degraded = await applyCookies(flakyContext, [
    { name: 'good' }, { name: 'bad' },
  ]);
  assert.equal(degraded.applied, 1);
  assert.equal(degraded.failed, 1);
  assert.equal(degraded.errors[0].name, 'bad');
  assert.ok(degraded.bulkError.includes('bulk rejected'));

  const empty = await applyCookies(okContext, []);
  assert.equal(empty.applied, 0);
});

test('summarizeState 汇总 cookie 数、storage 键与最早过期', () => {
  const state = normalizeStorageState({
    cookies: [
      { name: 'a', domain: 'aipoju.com', path: '/', value: '1', expires: 2_000_000_300 },
      { name: 'b', domain: 'aipoju.com', path: '/', value: '2', expires: 2_000_000_100 },
      { name: 'session', domain: 'aipoju.com', path: '/', value: '3' },
    ],
    origins: [{ origin: AIPOJU_ORIGIN, localStorage: [{ name: 'token', value: 'x' }] }],
  });
  const summary = summarizeState(state);
  assert.equal(summary.cookieCount, 3);
  assert.deepEqual(summary.storageKeys, ['token']);
  assert.equal(summary.earliestExpiry, 2_000_000_100);

  const noExpiry = summarizeState(normalizeStorageState({ localStorage: { k: 'v' } }));
  assert.equal(noExpiry.earliestExpiry, null);
});
