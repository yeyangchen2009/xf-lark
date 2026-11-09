'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { redact, redactUrl, publicError } = require('../src/utils/redact');

test('redactUrl 清理 userinfo/query/hash，并脱敏 docx 能力 URL 路径', () => {
  assert.equal(
    redactUrl('https://user:pass@aipoju.com/docx/camp123/token456?sign=abc#frag'),
    'https://aipoju.com/docx/REDACTED/REDACTED',
  );
  assert.equal(
    redactUrl('https://aipoju.com/path/aa11bb22cc33dd44ee55ff6600778899aabbccddeeff00112233445566778899/file.zip'),
    'https://aipoju.com/path/REDACTED/file.zip',
  );
  assert.equal(redactUrl('not a url'), 'not a url');
});

test('redact 处理敏感 header 与 query，URL 内 query 由 redactUrl 整体清空', () => {
  assert.match(redact('authorization: Bearer abc123'), /authorization: <redacted>/);
  assert.match(redact('log line ?token=secret&sign=xyz done'), /token=<redacted>/);
  assert.match(redact('log line ?token=secret&sign=xyz done'), /sign=<redacted>/);
  assert.equal(redact('curl https://x.invalid/a?token=secret&keep=1'), 'curl https://x.invalid/a');
});

test('publicError 提取错误消息并脱敏，空值有兜底', () => {
  assert.equal(
    publicError(new Error('boom https://aipoju.com/docx/c/t?x=1')),
    'boom https://aipoju.com/docx/REDACTED/REDACTED',
  );
  assert.equal(publicError(null), '未知错误');
  assert.equal(publicError('plain text'), 'plain text');
});
