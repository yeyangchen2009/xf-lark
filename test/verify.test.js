'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {
  inspectZipHead,
  inspectZipTail,
  inspectZipBuffer,
  verifyArtifact,
} = require('../src/verify');
const { DownloadError } = require('../src/errors');

const TEMP_ROOT = 'F:/temp/xf-lark-tests';
let tempDir;

// 只构造 verify 关心的字节：本地文件头 + 填充 + EOCD（22 字节）
function fakeZip(entries) {
  const head = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
  const padding = Buffer.from('padding-bytes-padding-bytes');
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries, 10);
  eocd.writeUInt16LE(entries, 12);
  return Buffer.concat([head, padding, eocd]);
}

before(async () => {
  await fs.mkdir(TEMP_ROOT, { recursive: true });
  tempDir = await fs.mkdtemp(path.join(TEMP_ROOT, 'verify-'));
});

after(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

test('inspectZipHead/inspectZipTail 识别手造 ZIP 的签名与条目数', () => {
  const zip = fakeZip(3);
  assert.equal(inspectZipHead(zip), true);
  assert.equal(inspectZipHead(Buffer.from([0, 1, 2, 3])), false);
  const tailInfo = inspectZipTail(zip);
  assert.equal(tailInfo.entries, 3);
  assert.ok(tailInfo.eocdOffset >= 0);
  assert.equal(inspectZipBuffer(zip).entries, 3);

  assert.equal(inspectZipTail(Buffer.alloc(30)), null);
  assert.equal(inspectZipTail(fakeZip(0)), null);
  assert.equal(inspectZipTail(fakeZip(0xffff)), null);
});

test('verifyArtifact 验收合法 ZIP 并报告条目数', async () => {
  const zipPath = path.join(tempDir, 'good.zip');
  await fs.writeFile(zipPath, fakeZip(127));
  const result = await verifyArtifact(zipPath);
  assert.equal(result.entries, 127);
  assert.ok(result.size > 0);
});

test('verifyArtifact 验收合法 UTF-8 Markdown', async () => {
  const mdPath = path.join(tempDir, 'good.md');
  await fs.writeFile(mdPath, '# 标题\n\n正文内容\n');
  const result = await verifyArtifact(mdPath);
  assert.equal(result.ext, '.md');
  assert.equal(result.entries, null);
});

test('verifyArtifact 拒绝空文件、坏 ZIP、坏 UTF-8、缺失文件与未知扩展名', async () => {
  const empty = path.join(tempDir, 'empty.zip');
  await fs.writeFile(empty, Buffer.alloc(0));
  await assert.rejects(() => verifyArtifact(empty), DownloadError);

  const truncated = path.join(tempDir, 'truncated.zip');
  await fs.writeFile(truncated, Buffer.from([0x50, 0x4b, 0x03, 0x04, 0, 0, 0]));
  await assert.rejects(() => verifyArtifact(truncated), DownloadError);

  const badMd = path.join(tempDir, 'bad.md');
  await fs.writeFile(badMd, Buffer.from([0xff, 0xfe, 0xfd]));
  await assert.rejects(() => verifyArtifact(badMd), DownloadError);

  const blankMd = path.join(tempDir, 'blank.md');
  await fs.writeFile(blankMd, '   \n  \n');
  await assert.rejects(() => verifyArtifact(blankMd), DownloadError);

  await assert.rejects(() => verifyArtifact(path.join(tempDir, 'missing.zip')), DownloadError);

  const txt = path.join(tempDir, 'weird.txt');
  await fs.writeFile(txt, 'hello');
  await assert.rejects(() => verifyArtifact(txt), DownloadError);
});
