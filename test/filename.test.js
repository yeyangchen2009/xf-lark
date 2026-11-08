'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const {
  sanitizeFilename,
  monthDirName,
  assertWithinDir,
  collisionPath,
  resolveExt,
  planListed,
  planDirect,
  joinTarget,
  MAX_FILENAME_CHARS,
} = require('../src/utils/filename');
const { UsageError } = require('../src/errors');

test('sanitizeFilename 清理非法字符、控制字符、空白、尾点与 Windows 保留名', () => {
  assert.equal(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j'), 'a_b_c_d_e_f_g_h_i_j');
  assert.equal(sanitizeFilename('  多处   空白  合并  '), '多处 空白 合并');
  assert.equal(sanitizeFilename('a\tb\nc'), 'a b c');
  assert.equal(sanitizeFilename('name...   '), 'name');
  assert.equal(sanitizeFilename('CON'), '_CON');
  assert.equal(sanitizeFilename('com1.txt'), '_com1.txt');
  assert.equal(sanitizeFilename(''), 'document');
  assert.equal(sanitizeFilename(null, 'fallback'), 'fallback');
  assert.equal(sanitizeFilename('   '), 'document');
});

test('sanitizeFilename 按 Unicode 码点截断为 80 字符，不切断代理对', () => {
  const result = sanitizeFilename('😀'.repeat(81));
  assert.equal([...result].length, MAX_FILENAME_CHARS);
  assert.equal(result, '😀'.repeat(80));
  const mixed = sanitizeFilename(`${'x'.repeat(90)}.zip`);
  assert.equal([...mixed].length, 80);
});

test('monthDirName 空值归 direct，其余去横线并消毒', () => {
  assert.equal(monthDirName(undefined), 'direct');
  assert.equal(monthDirName(''), 'direct');
  assert.equal(monthDirName('2026-09'), '202609');
  assert.equal(monthDirName('202609'), '202609');
});

test('resolveExt 仅 .zip 保留，其余产物一律 .md', () => {
  assert.equal(resolveExt('Agent Skills锤炼营实战手册.zip'), '.zip');
  assert.equal(resolveExt('纯文本手册.md'), '.md');
  assert.equal(resolveExt('weird.name.txt'), '.md');
  assert.equal(resolveExt(''), '.md');
  assert.equal(resolveExt(undefined), '.md');
});

test('collisionPath 先 campId 后缀再序列号，existsFn 可注入', () => {
  const existing = new Set(['D:/out/direct/a.zip', 'D:/out/direct/a_camp1234.zip']);
  const existsFn = p => existing.has(p.replace(/\\/g, '/'));
  assert.equal(
    collisionPath('D:/out/direct/a.zip', 'camp123456789', existsFn),
    path.join('D:/out/direct', 'a_camp1234_2.zip'),
  );
  const clean = new Set();
  assert.equal(
    collisionPath('D:/out/direct/a.zip', 'camp123456789', p => clean.has(p)),
    path.join('D:/out/direct', 'a_camp1234.zip'),
  );
  assert.equal(
    collisionPath('D:/out/direct/a.zip', '', p => clean.has(p)),
    path.join('D:/out/direct', 'a.zip'),
  );
});

test('assertWithinDir 放行目录内路径，拦截 ../ 与绝对路径逃逸', () => {
  const dir = path.join(os.tmpdir(), 'xfl-fn');
  assert.doesNotThrow(() => assertWithinDir(dir, path.join(dir, '202609', 'a.zip')));
  assert.throws(() => assertWithinDir(dir, path.join(dir, '..', 'outside.zip')), UsageError);
  assert.throws(() => assertWithinDir(dir, path.resolve('D:/elsewhere/a.zip')), UsageError);
});

test('planListed 无同名返回 ready，.zip/.md 任一存在即 skipped', () => {
  const outputDir = path.join(os.tmpdir(), 'xfl-fn-plan');
  const ready = planListed({ outputDir, month: '202609', title: '手册A', existsFn: () => false });
  assert.equal(ready.status, 'ready');
  assert.equal(ready.directory, path.resolve(outputDir, '202609'));
  assert.equal(ready.stem, '手册A');

  const zipExisting = p => p.endsWith(path.join('202609', '手册B.zip'));
  const skippedZip = planListed({ outputDir, month: '202609', title: '手册B', existsFn: zipExisting });
  assert.equal(skippedZip.status, 'skipped');
  assert.ok(skippedZip.existing.endsWith('手册B.zip'));

  const mdExisting = p => p.endsWith(path.join('202609', '手册C.md'));
  const skippedMd = planListed({ outputDir, month: '202609', title: '手册C', existsFn: mdExisting });
  assert.equal(skippedMd.status, 'skipped');
  assert.ok(skippedMd.existing.endsWith('手册C.md'));
});

test('planListed 进程内 reserved 集合防同批撞车', () => {
  const outputDir = path.join(os.tmpdir(), 'xfl-fn-reserved');
  const reserved = new Set([path.resolve(outputDir, '202609', '手册D.zip')]);
  const plan = planListed({ outputDir, month: '202609', title: '手册D', existsFn: () => false, reserved });
  assert.equal(plan.status, 'skipped');
});

test('planDirect 首名直取，冲突走 campId 改名并登记 reserved', () => {
  const outputDir = path.join(os.tmpdir(), 'xfl-fn-direct');
  const reserved = new Set();
  const first = planDirect({
    outputDir, suggestedName: '直传手册.zip', campId: 'campabcdefghi',
    existsFn: () => false, reserved,
  });
  assert.ok(first.target.endsWith(path.join('direct', '直传手册.zip')));
  assert.ok(reserved.has(first.target));

  const second = planDirect({
    outputDir, suggestedName: '直传手册.zip', campId: 'campabcdefghi',
    existsFn: p => reserved.has(p), reserved,
  });
  assert.ok(second.target.endsWith(path.join('direct', '直传手册_campabcd.zip')));
});

test('joinTarget 归一扩展名并拦截目录逃逸', () => {
  const outputDir = path.join(os.tmpdir(), 'xfl-fn-join');
  const directory = path.resolve(outputDir, '202609');
  assert.equal(joinTarget({ outputDir, directory, stem: 'a', ext: '.zip' }), path.join(directory, 'a.zip'));
  assert.equal(joinTarget({ outputDir, directory, stem: 'a', ext: '.md' }), path.join(directory, 'a.md'));
  assert.equal(joinTarget({ outputDir, directory, stem: 'a', ext: '.weird' }), path.join(directory, 'a.md'));
  assert.throws(
    () => joinTarget({ outputDir, directory: path.resolve(outputDir, '..', 'escape'), stem: 'a', ext: '.zip' }),
    UsageError,
  );
});
