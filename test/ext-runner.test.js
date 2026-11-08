'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ensureSinglePage, guardSinglePage } = require('../src/browser/ext-runner');
const { DownloadError } = require('../src/errors');

function fakePage(name) {
  return {
    name,
    closed: false,
    isClosed() { return this.closed; },
    close() { this.closed = true; return Promise.resolve(); },
  };
}

function fakeContext(pages) {
  const listeners = new Map();
  return {
    _pages: pages,
    pages() { return this._pages.filter(page => !page.closed); },
    newPage() {
      const page = fakePage('new');
      this._pages.push(page);
      return Promise.resolve(page);
    },
    on(event, handler) {
      listeners.set(event, handler);
    },
    emit(event, value) {
      listeners.get(event)?.(value);
    },
  };
}

test('ensureSinglePage: 多个标签页时从末尾关闭，只留第一个并返回它', async () => {
  const first = fakePage('first');
  const second = fakePage('second');
  const third = fakePage('third');
  const context = fakeContext([first, second, third]);

  const kept = await ensureSinglePage(context);

  assert.equal(kept, first);
  assert.equal(first.closed, false);
  assert.equal(second.closed, true);
  assert.equal(third.closed, true);
  assert.equal(context.pages().length, 1);
});

test('ensureSinglePage: 无标签页时新建一个', async () => {
  const context = fakeContext([]);
  const page = await ensureSinglePage(context);
  assert.equal(context.pages().length, 1);
  assert.equal(context.pages()[0], page);
});

test('guardSinglePage: 新标签页立即关闭，首次未关掉时延迟补关', async () => {
  const context = fakeContext([]);
  guardSinglePage(context);

  const popup = fakePage('popup');
  let firstAttempt = true;
  popup.close = function () {
    if (firstAttempt) {
      firstAttempt = false;
      return Promise.reject(new Error('导航中无法关闭'));
    }
    this.closed = true;
    return Promise.resolve();
  };

  context.emit('page', popup);
  assert.equal(firstAttempt, false, '首次 close 已尝试');
  assert.equal(popup.isClosed(), false);

  await new Promise(resolve => setTimeout(resolve, 400));
  assert.equal(popup.isClosed(), true, '补关后标签页被关闭');
});

test('ensureSinglePage: close 持续失败且页面未关时抛 DownloadError，不死循环', async () => {
  const first = fakePage('first');
  const stuck = fakePage('stuck');
  stuck.isClosed = () => false;
  stuck.close = async () => { throw new Error('CDP 僵死'); };
  const context = fakeContext([first, stuck]);

  await assert.rejects(ensureSinglePage(context), DownloadError);
  assert.equal(first.closed, false, '保留页不应被关');
});

test('ensureSinglePage: close 报错但页面实际已关时正常收敛', async () => {
  const first = fakePage('first');
  const halfClosed = fakePage('half');
  halfClosed.closed = true;
  halfClosed.close = async () => { throw new Error('导航中无法关闭'); };
  const context = fakeContext([first, halfClosed]);

  const kept = await ensureSinglePage(context);
  assert.equal(kept, first);
  assert.equal(context.pages().length, 1);
});

test('ensureSinglePage: 首次 close 失败、补试成功时正常收敛', async () => {
  const first = fakePage('first');
  const flaky = fakePage('flaky');
  let attempt = 0;
  flaky.close = function () {
    attempt += 1;
    if (attempt === 1) return Promise.reject(new Error('导航中无法关闭'));
    this.closed = true;
    return Promise.resolve();
  };
  const context = fakeContext([first, flaky]);

  const kept = await ensureSinglePage(context);
  assert.equal(kept, first);
  assert.equal(attempt, 2, '补试一次后成功');
  assert.equal(context.pages().length, 1);
});
