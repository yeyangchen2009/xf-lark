'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { UsageError } = require('./errors');
const { publicError } = require('./utils/redact');

const AIPOJU_ORIGIN = 'https://aipoju.com';
const VALID_SAME_SITE = new Set(['Strict', 'Lax', 'None']);

// cookie 卫生：补全必需字段、剔除过期项、sameSite 缺省 Lax、None 强制 secure
function sanitizeCookie(cookie, nowSec = Date.now() / 1000) {
  if (!cookie || typeof cookie !== 'object') return null;
  const { name, domain, path: cookiePath, value } = cookie;
  if (!name || !domain || !cookiePath || value === undefined) return null;
  if (typeof cookie.expires === 'number' && cookie.expires > 0 && cookie.expires <= nowSec) return null;

  const out = { name, value: String(value), domain, path: cookiePath };
  if (typeof cookie.expires === 'number') out.expires = cookie.expires;
  if (cookie.httpOnly !== undefined) out.httpOnly = Boolean(cookie.httpOnly);
  if (cookie.secure !== undefined) out.secure = Boolean(cookie.secure);
  out.sameSite = VALID_SAME_SITE.has(cookie.sameSite) ? cookie.sameSite : 'Lax';
  if (out.sameSite === 'None') out.secure = true;
  return out;
}

// 双格式归一为 Playwright native { cookies, origins }
//   native: { cookies: [...], origins: [{ origin, localStorage: [{name,value}] }] }
//   legacy: { cookies: [...], localStorage: { k: v } }   ← Python 版老文件，可能无 cookies 键
// 容忍仅 cookie / 仅 localStorage / 两者齐全；两种键并存时以 origins 为准
function normalizeStorageState(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new UsageError('登录态不是有效 JSON 对象');
  }

  const cookies = [];
  if (raw.cookies !== undefined) {
    if (!Array.isArray(raw.cookies)) throw new UsageError('登录态 cookies 必须是数组');
    for (const cookie of raw.cookies) {
      const clean = sanitizeCookie(cookie);
      if (clean) cookies.push(clean);
    }
  }

  const lsMap = new Map();
  if (raw.origins !== undefined) {
    if (!Array.isArray(raw.origins)) throw new UsageError('登录态 origins 必须是数组');
    for (const origin of raw.origins) {
      if (!origin || typeof origin.origin !== 'string' || !Array.isArray(origin.localStorage)) {
        throw new UsageError('登录态 origins 结构非法');
      }
      for (const item of origin.localStorage) {
        if (item && typeof item.name === 'string') lsMap.set(item.name, String(item.value ?? ''));
      }
    }
  } else if (raw.localStorage !== undefined) {
    if (typeof raw.localStorage !== 'object' || raw.localStorage === null || Array.isArray(raw.localStorage)) {
      throw new UsageError('登录态 localStorage 必须是对象');
    }
    for (const [name, value] of Object.entries(raw.localStorage)) {
      lsMap.set(name, String(value));
    }
  }

  if (!cookies.length && !lsMap.size) {
    throw new UsageError('登录态不含任何 cookie 或 localStorage，无法使用');
  }

  return {
    cookies,
    origins: [{
      origin: AIPOJU_ORIGIN,
      localStorage: [...lsMap.entries()].map(([name, value]) => ({ name, value })),
    }],
  };
}

async function loadStorageState(filePath) {
  let text;
  try {
    text = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new UsageError(`登录态文件读取失败: ${publicError(error)}`);
  }
  let raw;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new UsageError('登录态文件不是合法 JSON');
  }
  return normalizeStorageState(raw);
}

// 登录态含 bearer token：目录 0700、文件 0600
async function saveStorageState(filePath, state) {
  await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  await fs.writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
}

// bulk addCookies 失败时降级逐条，坏 cookie 不拖垮整批；返回脱敏后的失败明细
async function applyCookies(context, cookies) {
  if (!cookies.length) return { applied: 0, failed: 0, errors: [] };
  try {
    await context.addCookies(cookies);
    return { applied: cookies.length, failed: 0, errors: [] };
  } catch (bulkError) {
    const errors = [];
    let applied = 0;
    for (const cookie of cookies) {
      try {
        await context.addCookies([cookie]);
        applied += 1;
      } catch (error) {
        errors.push({ name: cookie.name, reason: publicError(error) });
      }
    }
    return { applied, failed: errors.length, errors, bulkError: publicError(bulkError) };
  }
}

function toLocalStorageItems(state) {
  const origin = state.origins.find(o => o.origin === AIPOJU_ORIGIN);
  return origin ? origin.localStorage : [];
}

function summarizeState(state) {
  const expiring = state.cookies
    .map(c => c.expires)
    .filter(expires => typeof expires === 'number' && expires > 0);
  return {
    cookieCount: state.cookies.length,
    storageKeys: toLocalStorageItems(state).map(item => item.name),
    earliestExpiry: expiring.length ? Math.min(...expiring) : null,
  };
}

module.exports = {
  AIPOJU_ORIGIN,
  sanitizeCookie,
  normalizeStorageState,
  loadStorageState,
  saveStorageState,
  applyCookies,
  toLocalStorageItems,
  summarizeState,
};
