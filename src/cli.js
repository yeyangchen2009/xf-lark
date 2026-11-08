'use strict';

const { parseArgs } = require('node:util');
const { UsageError, DownloadError } = require('./errors');
const { resolveProfileName, resolveProfileDir, resolveStoragePath, resolveOutputDir, resolveEdge } = require('./config');
const { publicError } = require('./utils/redact');

const HELP = `xf-lark：aipoju/飞书云文档 Markdown 下载器（主用简称 xfl）

用法：
  xfl doctor [--output-dir 目录] [--edge 路径]
  xfl login <aipoju 链接> [--profile 名称] [--storage 文件] [--edge 路径]
  xfl get <docx 链接...> [--month YYYYMM] [-o 词干] [--output-dir 目录]
        [--timeout 秒] [--storage 文件] [--edge 路径]
  xfl batch <manifest.json|links.md> [--month YYYYMM] [--offset N] [--limit N]
        [--output-dir 目录] [--timeout 秒] [--storage 文件] [--edge 路径]

通用选项：
  --profile 名称      登录 profile 名称，默认 default
  --storage 文件      登录态文件（兼容 Playwright storageState 与历史 Python 格式）
  --output-dir 目录   下载根目录，默认当前工作目录下 downloads
  --timeout 秒        单篇下载等待秒数，默认 300
  --edge 路径         本机 Edge 可执行文件，默认使用系统安装的 Edge

有头浏览器是硬约束：运行时会弹出 Edge 窗口，不支持 headless。
只下载本人已有权限的内容，登录由用户本人在浏览器中完成。
`;

const COMMANDS = ['doctor', 'login', 'get', 'batch'];

function optionsSpec(command) {
  const common = {
    profile: { type: 'string' },
    storage: { type: 'string' },
    edge: { type: 'string' },
    'output-dir': { type: 'string' },
    timeout: { type: 'string' },
    month: { type: 'string' },
  };
  if (command === 'get') return { ...common, o: { type: 'string' } };
  if (command === 'batch') return { ...common, offset: { type: 'string' }, limit: { type: 'string' } };
  return common;
}

function commandOptions(values) {
  if (values.o && values['output-dir']) throw new UsageError('-o 与 --output-dir 不能同时使用');
  const timeoutSeconds = values.timeout === undefined ? 300 : Number(values.timeout);
  if (!Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0) {
    throw new UsageError('--timeout 必须是正数秒');
  }
  return {
    profile: resolveProfileName({ profile: values.profile }),
    profileDir: resolveProfileDir({ profile: values.profile }),
    storagePath: resolveStoragePath({ storage: values.storage, profile: values.profile }),
    edge: resolveEdge({ edge: values.edge }),
    outputDir: resolveOutputDir({ outputDir: values['output-dir'] }),
    timeoutMs: timeoutSeconds * 1000,
    month: values.month,
    output: values.o,
  };
}

function nonNegative(value, name, defaultValue) {
  if (value === undefined) return defaultValue;
  if (!/^\d+$/.test(value)) throw new UsageError(`${name} 必须是非负整数`);
  return Number(value);
}

async function dispatch(command, positionals, values, signal) {
  const options = commandOptions(values);
  options.signal = signal;
  // PR3/PR4 逐个接通真实实现
  throw new DownloadError(`${command} 命令将在后续版本提供`);
}

async function main(argv) {
  if (!argv.length || argv[0] === '--help' || argv[0] === '-h') {
    console.log(HELP);
    return 0;
  }
  if (argv[0] === '--version' || argv[0] === '-v') {
    console.log(require('../package.json').version);
    return 0;
  }
  const command = argv[0];
  if (!COMMANDS.includes(command)) {
    console.error(`xfl: 未知命令 ${command}\n\n${HELP}`);
    return 2;
  }
  const controller = new AbortController();
  let interrupted = false;
  const onSigint = () => { interrupted = true; controller.abort(); };
  process.once('SIGINT', onSigint);
  try {
    const { values, positionals } = parseArgs({
      args: argv.slice(1), options: optionsSpec(command), allowPositionals: true, strict: true,
    });
    return await dispatch(command, positionals, values, controller.signal);
  } catch (error) {
    if (interrupted || controller.signal.aborted) return 130;
    const code = error.exitCode || (error.code?.startsWith?.('ERR_PARSE_ARGS') ? 2 : 1);
    console.error(`xfl: ${publicError(error)}`);
    return code;
  } finally {
    process.removeListener('SIGINT', onSigint);
  }
}

module.exports = { main, dispatch, commandOptions, nonNegative, HELP, COMMANDS };
