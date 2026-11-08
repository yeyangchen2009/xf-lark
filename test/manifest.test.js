'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {
  parseDocxUrl,
  parseMarkdownManifest,
  parseJsonManifest,
  loadManifest,
  filterEntries,
} = require('../src/manifest');
const { UsageError } = require('../src/errors');

const TEMP_ROOT = 'F:/temp/xf-lark-tests';
let tempDir;

const MD_FIXTURE = `# 行动手册总表

## 202609破局行动

### Agent Skills锤炼营实战手册-3
- 行动手册: https://aipoju.com/docx/campaaa/tokenbbb

### 数据分析大师-1
- 行动手册: https://aipoju.com/docx/campccc/tokenddd?from=groupmessage

## 202610破局行动

### 十月新手册-2
- 行动手册: https://aipoju.com/docx/campeee/tokenfff
`;

before(async () => {
  await fs.mkdir(TEMP_ROOT, { recursive: true });
  tempDir = await fs.mkdtemp(path.join(TEMP_ROOT, 'manifest-'));
});

after(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

test('parseDocxUrl 解析 camp/token，容忍 query，拒绝非法链接', () => {
  const parsed = parseDocxUrl('https://aipoju.com/docx/camp123/token456?x=1#frag');
  assert.equal(parsed.campId, 'camp123');
  assert.equal(parsed.token, 'token456');
  assert.ok(parsed.url.endsWith('?x=1#frag'));
  for (const bad of [
    'https://aipoju.com/other/camp123/token456',
    'https://example.com/docx/camp123/token456',
    'not a url',
    '',
  ]) {
    assert.throws(() => parseDocxUrl(bad), UsageError, `应拒绝 ${bad}`);
  }
});

test('parseMarkdownManifest 按月份/标题状态机产出条目', () => {
  const entries = parseMarkdownManifest(MD_FIXTURE);
  assert.equal(entries.length, 3);
  assert.deepEqual(entries[0], {
    month: '202609',
    title: 'Agent Skills锤炼营实战手册',
    count: 3,
    url: 'https://aipoju.com/docx/campaaa/tokenbbb',
    campId: 'campaaa',
    token: 'tokenbbb',
    direct: false,
  });
  assert.equal(entries[1].month, '202609');
  assert.equal(entries[1].count, 1);
  assert.equal(entries[2].month, '202610');
  assert.equal(entries[2].count, 2);
  assert.equal(parseMarkdownManifest('').length, 0);
});

test('parseMarkdownManifest 月份前链接与缺标题链接报带行号 UsageError', () => {
  const beforeMonth = `- 行动手册: https://aipoju.com/docx/campaaa/tokenbbb\n`;
  assert.throws(
    () => parseMarkdownManifest(beforeMonth),
    { name: 'UsageError', message: /第 1 行/ },
  );

  const missingTitle = `## 202609破局行动\n\n- 行动手册: https://aipoju.com/docx/campaaa/tokenbbb\n`;
  assert.throws(
    () => parseMarkdownManifest(missingTitle),
    { name: 'UsageError', message: /第 3 行/ },
  );
});

test('parseJsonManifest 白名单 schema：可选项与未知字段', () => {
  const entries = parseJsonManifest(JSON.stringify([
    { url: 'https://aipoju.com/docx/c1/t1' },
    { url: 'https://aipoju.com/docx/c2/t2', name: '直传文档', month: '202610' },
    { url: 'https://aipoju.com/docx/c3/t3', name: '仅名称无月份' },
  ]));
  assert.equal(entries.length, 3);
  assert.equal(entries[0].month, 'direct');
  assert.equal(entries[0].title, '');
  assert.equal(entries[0].direct, true);
  assert.equal(entries[1].month, '202610');
  assert.equal(entries[1].title, '直传文档');
  // 缺陷 C：带 name 的条目必须走清单条目语义（title 命名 + 同名 SKIP），不能标 direct
  assert.equal(entries[1].direct, false);
  assert.equal(entries[2].month, 'direct');
  assert.equal(entries[2].direct, false);

  assert.throws(() => parseJsonManifest('{}'), UsageError);
  assert.throws(() => parseJsonManifest('{bad'), UsageError);
  assert.throws(() => parseJsonManifest(JSON.stringify([{ url: 'https://aipoju.com/docx/c/t', extra: 1 }])), /未知字段/);
  assert.throws(() => parseJsonManifest(JSON.stringify([{ name: 'no-url' }])), /缺少 url/);
  assert.throws(() => parseJsonManifest(JSON.stringify([{ url: 'https://aipoju.com/docx/c/t', month: '2026-10' }])), /YYYYMM/);
});

test('loadManifest 按扩展名分流，不支持的扩展名报错', async () => {
  const mdFile = path.join(tempDir, 'links.md');
  const jsonFile = path.join(tempDir, 'jobs.json');
  const txtFile = path.join(tempDir, 'jobs.txt');
  await fs.writeFile(mdFile, MD_FIXTURE);
  await fs.writeFile(jsonFile, JSON.stringify([{ url: 'https://aipoju.com/docx/c1/t1' }]));
  await fs.writeFile(txtFile, 'whatever');

  assert.equal((await loadManifest(mdFile)).length, 3);
  assert.equal((await loadManifest(jsonFile)).length, 1);
  await assert.rejects(() => loadManifest(txtFile), UsageError);
});

test('filterEntries 支持 month 过滤、offset、limit 及组合', () => {
  const entries = parseMarkdownManifest(MD_FIXTURE);
  assert.deepEqual(filterEntries(entries, { month: '202609' }).map(e => e.campId), ['campaaa', 'campccc']);
  assert.deepEqual(filterEntries(entries, { offset: 1 }).map(e => e.campId), ['campccc', 'campeee']);
  assert.deepEqual(filterEntries(entries, { offset: 1, limit: 1 }).map(e => e.campId), ['campccc']);
  assert.deepEqual(filterEntries(entries, { month: '202610', limit: 5 }).map(e => e.campId), ['campeee']);
  assert.deepEqual(filterEntries(entries), entries);
});
