'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { DownloadError } = require('./errors');

// ZIP 本地文件头签名 PK\x03\x04；EOCD（中央目录结束）签名 PK\x05\x06
const LOCAL_FILE_HEADER = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
const EOCD_SIGNATURE = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
// EOCD 本身 22 字节，前置注释最长 65535 字节
const TAIL_WINDOW = 65536 + 22;

function inspectZipHead(headBuf) {
  return Buffer.isBuffer(headBuf) && headBuf.length >= 4 && headBuf.subarray(0, 4).equals(LOCAL_FILE_HEADER);
}

// 在尾部窗口找 EOCD，读条目数；0 条目与 ZIP64 的 0xFFFF 哨兵都判不可信（本场景不触及 ZIP64）
function inspectZipTail(tailBuf) {
  if (!Buffer.isBuffer(tailBuf) || tailBuf.length < 22) return null;
  const index = tailBuf.lastIndexOf(EOCD_SIGNATURE);
  if (index < 0) return null;
  const entries = tailBuf.readUInt16LE(index + 10);
  if (entries < 1 || entries === 0xffff) return null;
  return { entries, eocdOffset: index };
}

// 整块 buffer 版，便于单测手造小 ZIP
function inspectZipBuffer(buf) {
  if (!inspectZipHead(buf)) return null;
  return inspectZipTail(buf);
}

async function verifyArtifact(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch (error) {
    throw new DownloadError(`产物不存在: ${path.basename(filePath)}`);
  }
  if (!stat.isFile() || stat.size === 0) {
    throw new DownloadError(`产物为空或不是文件: ${path.basename(filePath)}`);
  }

  if (ext === '.zip') {
    // 大文件只读头 4 字节与尾部窗口，不全量入内存（历史产物最大 252MB）
    const fh = await fs.open(filePath, 'r');
    try {
      const head = Buffer.alloc(4);
      await fh.read(head, 0, 4, 0);
      if (!inspectZipHead(head)) {
        throw new DownloadError(`ZIP 头部签名错误，文件可能已损坏: ${path.basename(filePath)}`);
      }
      const tailLen = Math.min(stat.size, TAIL_WINDOW);
      const tail = Buffer.alloc(tailLen);
      await fh.read(tail, 0, tailLen, stat.size - tailLen);
      const info = inspectZipTail(tail);
      if (!info) {
        throw new DownloadError(`ZIP 尾部中央目录缺失或条目数异常，文件可能未下载完整: ${path.basename(filePath)}`);
      }
      return { path: filePath, ext, size: stat.size, entries: info.entries };
    } finally {
      await fh.close();
    }
  }

  if (ext === '.md') {
    const buf = await fs.readFile(filePath);
    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(buf);
      if (!text.trim()) {
        throw new DownloadError(`Markdown 产物为空白: ${path.basename(filePath)}`);
      }
    } catch (error) {
      if (error instanceof DownloadError) throw error;
      throw new DownloadError(`Markdown 不是合法 UTF-8，文件可能已损坏: ${path.basename(filePath)}`);
    }
    return { path: filePath, ext, size: stat.size, entries: null };
  }

  throw new DownloadError(`不支持的产物类型: ${ext}`);
}

module.exports = {
  inspectZipHead,
  inspectZipTail,
  inspectZipBuffer,
  verifyArtifact,
  TAIL_WINDOW,
};
