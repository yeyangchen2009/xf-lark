'use strict';

const { parseArgs } = require('node:util');
const path = require('node:path');
const { UsageError, DownloadError } = require('./errors');
const {
  dataHome,
  tempRoot,
  resolveProfileName,
  resolveProfileDir,
  resolveStoragePath,
  resolveOutputDir,
  resolveEdge,
} = require('./config');
const { publicError } = require('./utils/redact');

const HELP = `xf-lark：飞书云文档 Markdown 下载器（主用简称 xfl）

用法：
  xfl doctor [--output-dir 目录] [--edge 路径]
  xfl login <飞书文档链接> [--profile 名称] [--storage 文件] [--edge 路径]
  xfl get <docx 链接...> [--month YYYYMM] [-o 词干] [--output-dir 目录]
        [--timeout 秒] [--storage 文件] [--edge 路径]
  xfl batch <manifest.json|links.md> [--month YYYYMM] [--offset N] [--limit N]
        [--output-dir 目录] [--timeout 秒] [--storage 文件] [--edge 路径]

通用选项：
  --profile 名称      登录 profile 名称，默认 default
  --storage 文件      登录态文件（兼容 Playwright storageState 与历史 Python 格式）
  --output-dir 目录   下载根目录，默认当前工作目录下 downloads
  --timeout 秒        单篇下载等待与落盘的超时秒数，默认 300
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
  options.offset = nonNegative(values.offset, '--offset', 0);
  options.limit = values.limit === undefined ? null : nonNegative(values.limit, '--limit');
  options.tempRoot = tempRoot();

  if (command === 'doctor') {
    const { runDoctor } = require('./doctor');
    const report = await runDoctor({
      edge: options.edge,
      dataHomeDir: dataHome(),
      outputDir: options.outputDir,
      storagePath: options.storagePath,
      tempRootDir: options.tempRoot,
      signal,
    });
    for (const check of report.checks) {
      process.stdout.write(`${check.ok ? '✔' : '✘'} ${check.name}: ${check.detail}\n`);
    }
    for (const warning of report.warnings) {
      process.stdout.write(`! ${warning.detail}\n`);
    }
    return report.ok ? 0 : 1;
  }

  if (command === 'login') {
    if (positionals.length !== 1) throw new UsageError('login 需要一个飞书文档链接作为参数');
    let loginUrl;
    try {
      loginUrl = new URL(positionals[0]);
    } catch {
      throw new UsageError('login 参数不是合法 URL');
    }
    if (loginUrl.protocol !== 'https:' && loginUrl.protocol !== 'http:') {
      throw new UsageError('login 仅接受 http(s) 链接');
    }
    if (!loginUrl.hostname.endsWith('aipoju.com')) {
      throw new UsageError('login 仅接受飞书文档链接');
    }
    const { login } = require('./browser/session');
    const summary = await login({
      edge: options.edge,
      profileDir: options.profileDir,
      storagePath: options.storagePath,
      signal,
    });
    process.stdout.write(
      `登录态已保存: ${options.storagePath}（cookie ${summary.cookieCount} 个，localStorage 键 ${summary.storageKeys.length} 个）\n`,
    );
    return 0;
  }

  if (command === 'get') {
    const { runGet } = require('./jobs');
    const summary = await runGet(positionals, options);
    process.stdout.write(
      `\n完成 ${summary.succeeded}/${summary.total}，失败 ${summary.failed.length}，报告: ${path.join(options.outputDir, 'xf-lark-report.md')}\n`,
    );
    return summary.failed.length ? 1 : 0;
  }

  // batch
  if (positionals.length !== 1) throw new UsageError('batch 需要一个清单文件路径（.json 或 .md）');
  const { runBatch } = require('./jobs');
  const summary = await runBatch(positionals[0], options);
  process.stdout.write(
    `\n完成 ${summary.succeeded}/${summary.total}，失败 ${summary.failed.length}，报告: ${path.join(options.outputDir, 'xf-lark-report.md')}\n`,
  );
  return summary.failed.length ? 1 : 0;
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
