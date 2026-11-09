# 0.1.0 手动验收清单（11 项）

自动化测试覆盖纯逻辑与本地仿造链路，本清单覆盖必须接触真实 aipoju 的部分。
在干净目录执行，避免历史产物干扰 SKIP 判断；每项通过后勾选并记录实测结果。

**验收终态（2026-11-09）**：1–4、6–9、11 共 10 项实测通过；第 5 项无真实样本标 N/A（自动化覆盖）；第 10 项中断逻辑通过、真实控制台 Ctrl+C 存在 Windows 平台限制（见该项注记），其暴露的临时 profile 残留已在 0.1.0 用启动清扫根治。详细记录与字节比对见验收工作目录 `results.md`。

## 环境与登录

- [x] **1. doctor 全绿**：无登录态时 `xfl doctor` 五项硬检查全部通过，登录态软提示报告「未发现可用登录态」，退出码 0。实测：登录后软提示正确报告 cookie/localStorage 计数与最早过期日；全局安装包复跑同样全绿（包内扩展 27 文件、service worker 注册可达）。
- [x] **2. login 落盘**：`xfl login "https://aipoju.com/docx/<camp>/<token>"`，在弹出的 Edge 中手动登录后回终端按 Enter；`~/.xf-lark/storage/default.json` 生成，文件权限为 0600，内容为 Playwright 原生 `{cookies, origins}` 结构。实测：NTFS 下 mode 位显示 0666 为 Node on Windows 已知语义，ACL 实测仅 SYSTEM/Administrators/当前用户可访问，等效 0600；origin 归一为 aipoju.com。
- [x] **3. legacy 登录态兼容**：把 Python 版仅含 localStorage 的 `aipoju_storage.json` 经 `--storage` 传入一次 get，能正常进入登录流程不报「不含任何 cookie 或 localStorage」。实测：cookie 0 个、localStorage 5 键的仅-localStorage 形态被正确归一，软提示「登录态可用」，退出码 0。

## 真实文档下载

- [x] **4. 图片密集 ZIP**：对 Agent Skills 锤炼营手册级文档执行 get，产出 ZIP 体积与 Python 版同量级（30MB+），报告打印 ZIP 条目数，`.tmp-*` 无残留。实测：33.93MB / 127 条目，与 Python 版字节差仅 4（ZIP 元数据），退出码 0，报告无 URL 泄漏。
- [x] **5. 纯文本 Markdown（N/A）**：对无图文档执行 get，产出 `.md` 且 UTF-8 校验通过。当前无真实无图文档样本，经用户确认标 N/A，fatal UTF-8 分支由 `verify.test.js` 单测与 `test:edge` 仿造链路覆盖。
- [x] **6. 无权限失败停下**：对本人无权限（或随机 token）的链接执行 get，明确报错停下、退出码 1，无 `.tmp-*` 与半成品正式文件，报告与控制台中的能力 URL 均脱敏为 `REDACTED`。实测注（2026-11 随机 token 链接）：无效文档上扩展按钮仍可能被注入，失败点可能是按钮轮询耗尽或下载产物超时，两种路径都安全失败不残留。本项验收中发现并修复缺陷 A（报告/控制台 URL 未脱敏）。
- [x] **7. 重跑 SKIP**：对第 4 项同一清单再跑一次 batch，已存在条目全部 SKIP 且不弹出重复下载，跳过数与已有文件数一致。实测：md 清单重跑 3/3 全 SKIP，退出码 0。
- [x] **8. 碰撞命名**：两个不同直传链接产出同名文档时，第二个改存 `<词干>_<campId 前8>.zip`，旧文件保留。实测：首篇 `碰撞同名.zip` 保留、次篇 `碰撞同名_028fbb73.zip`（campId 前 8 位后缀），退出码 0、零残留。首轮次篇遇浏览器侧僵死，900 秒超时兜底首次实战生效（自动报错、写失败报告、清理 Edge 与 profile、退出码 1），单条新鲜进程重跑成功。
- [x] **9. batch 双格式**：`.md` 三正则清单与 `.json` 白名单清单各跑一次，月份/offset/limit 过滤生效，`xf-lark-report.md` 的成功失败计数与实际文件一致。本项验收中发现并修复缺陷 B（单 tab 硬断言致整批中断，改自愈）、缺陷 C（JSON 带 name 条目被误标 direct 绕开命名与 SKIP），并补齐下载链路全链路超时兜底（坑⑥）。

## 中断与打包

- [x] **10. Ctrl+C（逻辑通过；真实控制台有 Windows 平台限制）**：
  - 中断逻辑（通过）：图片密集文档下载途中触发中断，AbortController 贯通到下载取消，`.tmp-*` 原子清理无半成品；退出码 130 由 `cli.test.js` 进程内 `process.emit('SIGINT')` 断言，报告标注「被中断（SIGINT）」由 `jobs.test.js` 断言。
  - 真实控制台实测（平台限制）：在 cmd 批处理容器与 PowerShell 直接跑 node 两种方式下按 Ctrl+C，均观察到 `FAIL: 下载已取消`、`.tmp` 零残留、Edge 进程清零、无半成品；但 Windows 的 CTRL_C_EVENT 广播到整个控制台进程组（含 playwright 拉起的 Edge 子进程），控制台宿主在 node 跑完异步深度收尾（写报告、finally 删 profile）前回收进程，故实测报告未写、TEMP 残留一个空的 `xfl-profile-*` 目录（唯一名、不含产物、无害，已手动清理）。这是 Node on Windows + 有头浏览器子进程的平台限制，非产品逻辑缺陷；进程内 SIGINT 不走控制台机制，故自动化能完整验证 130 与报告。数据安全不受影响：原子 `.tmp` 设计经受住真实强杀，正式产物要么完整要么不存在。**残留 profile 的根治已在 0.1.0 落地**：新增启动清扫（`session.js` 的 `cleanupStaleProfiles`），每次创建新临时 profile 前删除临时目录下同前缀、mtime 超 1 小时的残留目录，正在运行的新 profile（mtime 新）与前缀之外的文件一律不触碰，清扫失败不阻断主任务；由 4 项纯逻辑单测覆盖，并用真实 `doctor` 端到端实测：2 小时陈旧 profile 被精准删除、新 profile 与无关目录保留、退出码 0。强杀下中断报告仍来不及写（平台限制无法在信号路径绕过），但控制台已有逐条 OK/FAIL 实时输出兜底。
- [x] **11. pack 与双 bin**：`npm pack --dry-run` 清单含 27 个扩展 dist 文件且不含 test/、storage/、profiles/；`npm link`（或全局安装）后 `xfl --version` 与 `xf-lark --version` 都输出 0.1.0。实测：Program Files 全局 prefix 下 npm link 触发 EPERM，改用 F 盘临时 `--prefix` 真装 tgz，`xfl`/`xf-lark` 的 sh/cmd/ps1 三套 shim 的 `--version` 均为 0.1.0，全局包 doctor 全绿；dry-run 共 45 文件、无测试与数据文件。
