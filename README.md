# xf-lark

`xf-lark` 是面向本人已获授权内容的 aipoju/飞书云文档 Markdown 下载 CLI。它通过包内自带的 Cloud Document Converter 扩展（见 [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md)）驱动有头 Edge 完成文档转换与打包。日常命令使用 **`xfl`**，完整命令 `xf-lark` 等价。

- npm 包：<https://www.npmjs.com/package/xf-lark>
- 源码仓库：<https://github.com/yeyangchen2009/xf-lark>
- 当前版本：0.1.0

> 只下载本人已有权限的文档，不提供 DRM、验证码或权限绕过；扩展按钮在限定时间内不出现即判失败停下。

## 环境与安装

- Windows 10/11，Node.js 22+
- 本机 Microsoft Edge（默认走系统安装，也可用 `--edge` 指定可执行文件路径）
- 登录由用户本人在弹出的 Edge 中手动完成，不处理密码与验证码

```bash
npm install -g xf-lark
xfl doctor
```

不想全局安装时可用 npx，显式指定版本与简写命令：

```bash
npx --yes --package xf-lark@0.1.0 xfl doctor
```

## 使用

```bash
# 环境预检：Node 版本、扩展资产、有头 Edge 加载、目录可写、登录态软提示
xfl doctor

# 手动登录，登录态落盘到 ~/.xf-lark/storage/default.json（权限 0600）
xfl login "https://aipoju.com/docx/<行动营ID>/<文档token>"

# 直传一个或多个文档链接；默认落到 downloads/direct/
xfl get "https://aipoju.com/docx/<行动营ID>/<文档token>"
xfl get "https://aipoju.com/docx/c1/t1" "https://aipoju.com/docx/c2/t2" --month 202609

# 单链接可用 -o 自定义词干，扩展名以实际产物（.zip/.md）为准
xfl get "https://aipoju.com/docx/c1/t1" -o "Agent Skills锤炼营实战手册"

# 按清单批量下载
xfl batch handbook.md --month 202609 --offset 0 --limit 5
xfl batch jobs.json --output-dir "./downloads" --timeout 900
```

有头浏览器是硬约束：运行时会弹出 Edge 窗口，不支持 headless。每次下载运行都使用全新的临时浏览器 profile，原因见下文「单标签页约束」。

### 清单格式

Markdown 清单沿用行动手册总表的三正则结构，按 `## YYYYMM破局行动` 月份分节、`### 名称-序号` 标题归属：

```markdown
## 202609破局行动

### Agent Skills锤炼营实战手册-3
- 行动手册: https://aipoju.com/docx/campaaa/tokenbbb
```

JSON 清单走严格白名单，仅接受 `url/name/month` 三个字段，未知字段直接报错：

```json
[
  { "url": "https://aipoju.com/docx/c1/t1" },
  { "url": "https://aipoju.com/docx/c2/t2", "name": "手册二", "month": "202610" }
]
```

`name` 字段决定条目语义：

- 不带 `name`：直传语义，文件名跟随浏览器下载建议，落 `downloads/direct/`，同名碰撞按 `<词干>_<行动营ID前8>` 改名。
- 带 `name`：与 Markdown 清单条目同语义，按名称命名并参与同名 SKIP；给了 `month` 落月份目录，缺省落 `downloads/direct/`。

任务串行执行，单项失败会计入报告并使退出码为 1，不影响后续条目。

### 验收状态

| 通路 | 状态 |
| --- | --- |
| 纯函数层（命名、登录态归一、清单解析、产物校验、脱敏、临时 profile 清扫） | 61 项自动化单测全绿，无需浏览器（另 3 项 Edge 门禁在无浏览器环境自动跳过） |
| 有头 Edge 扩展加载 | `test:edge` 实测通过：临时 profile 启动并确认扩展 service worker 注册 |
| 按钮轮询、下载竞速、saveAs、产物校验全链路 | 本地 127.0.0.1 仿造页面实测通过，自动化永不访问真实 aipoju |
| storageState 往返 | 本地服务种 cookie 与 localStorage 实测通过，兼容仅 localStorage 的 Python 老格式 |
| 真实文档端到端 | 已手动验收通过：3 份真实大文档与 Python 版 ZIP 条目级等价（字节差仅时间戳等元数据），重跑 SKIP、直传碰撞改名、无权限失败零残留、超时兜底、双 bin 全局安装均实测，清单见 [docs/manual-acceptance.md](./docs/manual-acceptance.md) |

Windows 控制台的真实 Ctrl+C 可能在 node 异步收尾完成前回收进程，临时目录可能残留一个空的 profile 目录（唯一名、无害，`.tmp` 原子写入保证不会留下半成品产物）。程序每次启动会清扫临时目录下同前缀、超过 1 小时未变动的残留 profile，正在运行的新 profile 不会被误删；中断退出码 130 与「被中断」报告在进程内信号路径由自动化测试覆盖。

## 文件与隐私

- 默认输出为当前目录 `downloads/`，月份子目录如 `downloads/202609/`，直传链接落 `downloads/direct/`；数据目录在用户目录 `.xf-lark/`。
- 环境变量 `XF_LARK_HOME`、`XF_LARK_TEMP`、`XF_LARK_EDGE` 可覆盖数据目录、临时 profile 根目录与 Edge 路径。
- 登录态是 bearer token 级敏感数据：目录权限 0700、文件权限 0600，不进入 npm 包与 git；兼容 Playwright storageState 与 Python 版扁平 `{cookies, localStorage}` 两种格式，login 只写原生格式。
- 产物先写同目录 `.tmp-<pid>-N`，通过 ZIP 头尾浅校验或 Markdown fatal UTF-8 校验后才原子改名；坏文件不会占用正式文件名，失败时临时文件自动清理。
- 日志与报告默认脱敏：aipoju 能力 URL 的 camp/token 路径整体替换为 `REDACTED`，鉴权头与签名 query 不落地。
- 单标签页约束：扩展 background 要求窗口恰好 1 个活动标签页才注入转换脚本，且默认 legacyFileSave 下载方式才能被 Playwright 捕获。每次运行用 mkdtemp 新鲜临时 profile 同时满足这两个前提，运行结束自动清理；意外弹窗会被立即关闭。
- 同名 `.zip`/`.md` 任一存在即跳过；直传碰撞按 `<词干>_<行动营ID前8>` 改名，再撞追加序号。进程内预留集合防止同批撞车，不要同时启动两个 `xfl` 进程写同一输出目录。

## 与 Python 版产物的兼容

本包是 `handbook-downloader/download_with_ext.py` 的 Node 化重写，产物目录结构与命名规则刻意对齐：

- 文件名词干按 80 Unicode 码点截断，与 Python 版一致，老输出目录重跑能正确命中 SKIP；
- 月份目录、双扩展名 SKIP、direct 碰撞命名规则一致；
- 修复了 Python 版两个静默问题：清单缺月份/缺标题时带行号报错而不是丢数据，坏文件不再因占位而被永久 SKIP；
- 单项失败不再吞退出码：有失败时进程退出码为 1。

## 开发

从源码安装本地链接：

```bash
git clone https://github.com/yeyangchen2009/xf-lark.git
cd xf-lark
npm install
npm link
```

测试与打包自检：

```bash
npm test              # 纯函数与编排测试，无需浏览器
npm run test:edge     # 真实有头 Edge 门禁，会弹窗
npm pack --dry-run    # 打包清单自检（扩展 dist 随包分发，测试不进包）
```

真实平台测试不进入默认测试，仓库内不接受私人 URL 或 Cookie。发版前的手动验收步骤见 [docs/manual-acceptance.md](./docs/manual-acceptance.md)。
