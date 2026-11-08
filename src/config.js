'use strict';

const os = require('node:os');
const path = require('node:path');
const { UsageError } = require('./errors');

function dataHome(env = process.env) {
  return path.resolve(env.XF_LARK_HOME || path.join(os.homedir(), '.xf-lark'));
}

function resolveProfileName(options = {}) {
  const name = options.profile || 'default';
  if (!/^[A-Za-z0-9_-][A-Za-z0-9._-]*$/.test(name) || name === '.' || name === '..') {
    throw new UsageError('profile 名称只能包含字母、数字、点、下划线和连字符');
  }
  return name;
}

function resolveProfileDir(options = {}, env = process.env) {
  if (options.profileDir) return path.resolve(options.profileDir);
  const name = resolveProfileName(options);
  return path.join(dataHome(env), 'profiles', name);
}

function resolveStoragePath(options = {}, env = process.env) {
  if (options.storage) return path.resolve(options.storage);
  const name = resolveProfileName(options);
  return path.join(dataHome(env), 'storage', `${name}.json`);
}

function resolveOutputDir(options = {}, cwd = process.cwd()) {
  return path.resolve(cwd, options.outputDir || 'downloads');
}

function tempRoot(env = process.env) {
  return path.resolve(env.XF_LARK_TEMP || os.tmpdir());
}

function resolveEdge(options = {}, env = process.env) {
  return options.edge || env.XF_LARK_EDGE || undefined;
}

function extensionPath() {
  return path.join(__dirname, 'vendor', 'extension', 'dist');
}

module.exports = {
  dataHome,
  resolveProfileName,
  resolveProfileDir,
  resolveStoragePath,
  resolveOutputDir,
  tempRoot,
  resolveEdge,
  extensionPath,
};
