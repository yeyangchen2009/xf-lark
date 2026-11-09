'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { UsageError } = require('./errors');

const DOCX_URL_RE = /^https:\/\/aipoju\.com\/docx\/([^/]+)\/([^/?]+)(?:\?.*)?$/;
const MONTH_RE = /^## (\d{6})破局行动/;
const TITLE_RE = /^### (.+?)-(\d+)$/;
const DOCX_LINE_RE = /^- 行动手册: (https:\/\/aipoju\.com\/docx\/.+)$/;
const JSON_ALLOWED_KEYS = new Set(['url', 'name', 'month']);

function parseDocxUrl(value) {
  const raw = String(value ?? '').trim();
  const match = DOCX_URL_RE.exec(raw);
  if (!match) throw new UsageError(`不是合法的 aipoju docx 链接: ${raw}`);
  return { campId: match[1], token: match[2], url: raw };
}

// Python 版三正则状态机；两处 Python 静默丢数据改为带行号 UsageError：
//   ① 月份标题之前出现手册链接；② 手册链接缺少所属 ### 标题
function parseMarkdownManifest(text) {
  const entries = [];
  let currentMonth = null;
  let currentTitle = null;
  let currentCount = null;

  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lineNo = i + 1;
    const monthMatch = MONTH_RE.exec(line);
    if (monthMatch) {
      currentMonth = monthMatch[1];
      currentTitle = null;
      currentCount = null;
      continue;
    }
    const titleMatch = TITLE_RE.exec(line);
    if (titleMatch) {
      currentTitle = titleMatch[1].trim();
      currentCount = Number(titleMatch[2]);
      continue;
    }
    const docxMatch = DOCX_LINE_RE.exec(line);
    if (docxMatch) {
      if (!currentMonth) {
        throw new UsageError(`清单第 ${lineNo} 行：手册链接出现在月份标题（## YYYYMM破局行动）之前`);
      }
      if (!currentTitle) {
        throw new UsageError(`清单第 ${lineNo} 行：手册链接缺少所属标题（### 名称-序号）`);
      }
      const { campId, token, url } = parseDocxUrl(docxMatch[1]);
      entries.push({
        month: currentMonth,
        title: currentTitle,
        count: currentCount,
        url,
        campId,
        token,
        direct: false,
      });
      currentTitle = null;
      currentCount = null;
    }
  }
  return entries;
}

// 严格白名单 schema：[{ url, name?, month? }]，未知键直接拒绝
function parseJsonManifest(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new UsageError('JSON 清单不是合法 JSON');
  }
  if (!Array.isArray(raw)) throw new UsageError('JSON 清单顶层必须是数组');

  return raw.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new UsageError(`JSON 清单第 ${index + 1} 项必须是对象`);
    }
    const unknown = Object.keys(item).filter(key => !JSON_ALLOWED_KEYS.has(key));
    if (unknown.length) {
      throw new UsageError(`JSON 清单第 ${index + 1} 项含未知字段: ${unknown.join(', ')}`);
    }
    if (!item.url) throw new UsageError(`JSON 清单第 ${index + 1} 项缺少 url`);
    const { campId, token, url } = parseDocxUrl(item.url);
    if (item.month !== undefined && !/^\d{6}$/.test(String(item.month))) {
      throw new UsageError(`JSON 清单第 ${index + 1} 项 month 必须是 YYYYMM 六位月份`);
    }
    return {
      month: item.month ? String(item.month) : 'direct',
      title: item.name ? String(item.name) : '',
      count: null,
      url,
      campId,
      token,
      // 带 name 的条目等同 md 清单条目：按 title 命名并参与同名 SKIP；
      // 无 name 才是直传语义，命名跟随扩展 suggestedFilename（缺陷 C：曾无条件 true）
      direct: !item.name,
    };
  });
}

async function loadManifest(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const text = await fs.readFile(filePath, 'utf8');
  if (ext === '.json') return parseJsonManifest(text);
  if (ext === '.md' || ext === '.markdown') return parseMarkdownManifest(text);
  throw new UsageError('清单仅支持 .json 或 .md 文件');
}

// month 过滤后再做 offset/limit 切片；offset/limit 由 cli 层保证为非负整数
function filterEntries(entries, { month = null, offset = 0, limit = null } = {}) {
  let result = entries;
  if (month) result = result.filter(entry => entry.month === month);
  result = result.slice(offset);
  if (limit !== null) result = result.slice(0, limit);
  return result;
}

module.exports = {
  DOCX_URL_RE,
  parseDocxUrl,
  parseMarkdownManifest,
  parseJsonManifest,
  loadManifest,
  filterEntries,
};
