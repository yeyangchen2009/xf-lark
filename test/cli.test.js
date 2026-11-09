'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
const { spawnSync } = require('node:child_process');
const { main } = require('../src/cli');

const bin = path.resolve(__dirname, '../bin/xf-lark.js');
const originalLoad = Module._load;

test('黑盒：--version/--help 正常，未知命令退出码 2', () => {
  const version = spawnSync(process.execPath, [bin, '--version'], { encoding: 'utf8' });
  assert.equal(version.status, 0);
  assert.equal(version.stdout.trim(), require('../package.json').version);

  const help = spawnSync(process.execPath, [bin, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /xfl doctor/);
  assert.match(help.stdout, /有头浏览器是硬约束/);

  const unknown = spawnSync(process.execPath, [bin, 'frobnicate'], { encoding: 'utf8' });
  assert.equal(unknown.status, 2);
});

test('package.json 双 bin 名指向同一入口', () => {
  const pkg = require('../package.json');
  assert.equal(pkg.bin['xf-lark'], './bin/xf-lark.js');
  assert.equal(pkg.bin.xfl, './bin/xf-lark.js');
});

test('参数与链接错误统一退出码 2', async () => {
  assert.equal(await main(['get']), 2);
  assert.equal(await main(['get', 'not-a-url']), 2);
  assert.equal(await main([
    'get',
    'https://aipoju.com/docx/c1/t1',
    'https://aipoju.com/docx/c2/t2',
    '-o', 'stem',
  ]), 2);
  assert.equal(await main(['get', 'https://aipoju.com/docx/c1/t1', '-o', 'a', '--output-dir', 'b']), 2);
  assert.equal(await main(['get', 'https://aipoju.com/docx/c1/t1', '--timeout', '0']), 2);
  assert.equal(await main(['get', 'https://aipoju.com/docx/c1/t1', '--timeout', 'abc']), 2);
  assert.equal(await main(['batch']), 2);
  assert.equal(await main(['login']), 2);
  assert.equal(await main(['login', 'not-a-url']), 2);
  assert.equal(await main(['login', 'https://evil.example.com/docx/c/t']), 2);
  assert.equal(await main(['doctor', '--unknown-flag']), 2);
});

test('login 合法 aipoju 链接走浏览器登录并返回 0', async () => {
  let called = null;
  Module._load = function (request, parent, isMain) {
    if (parent?.filename?.endsWith(path.join('src', 'cli.js')) && request === './browser/session') {
      return {
        login: async options => {
          called = options;
          return { cookieCount: 1, storageKeys: ['token'], earliestExpiry: null };
        },
      };
    }
    return originalLoad.call(this, request, parent, isMain);
  };
  try {
    const code = await main(['login', 'https://aipoju.com/docx/c1/t1', '--profile', 'work']);
    assert.equal(code, 0);
    assert.match(called.storagePath, /[\\/].xf-lark[\\/]storage[\\/]work\.json$/);
  } finally {
    Module._load = originalLoad;
  }
});

test('SIGINT 中断任务时返回 130，不被作业层吞成 1', async () => {
  const jobsPath = require.resolve('../src/jobs');
  const cached = require.cache[jobsPath];
  delete require.cache[jobsPath];
  Module._load = function (request, parent, isMain) {
    if (parent?.filename?.endsWith(path.join('src', 'cli.js')) && request === './jobs') {
      return {
        runGet: (_urls, options) => new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => {
            reject(options.signal.reason || new Error('下载已中止'));
          }, { once: true });
        }),
      };
    }
    return originalLoad.call(this, request, parent, isMain);
  };
  try {
    const pending = main(['get', 'https://aipoju.com/docx/c1/t1']);
    await new Promise(resolve => setImmediate(resolve));
    process.emit('SIGINT');
    assert.equal(await pending, 130);
  } finally {
    Module._load = originalLoad;
    delete require.cache[jobsPath];
    if (cached) require.cache[jobsPath] = cached;
  }
});
