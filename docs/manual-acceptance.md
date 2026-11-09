# 0.1.0 手动验收清单（11 项）

自动化测试覆盖纯逻辑与本地仿造链路，本清单覆盖必须接触真实 aipoju 的部分。
在干净目录执行，避免历史产物干扰 SKIP 判断；每项通过后勾选并记录实测结果。

## 环境与登录

- [ ] **1. doctor 全绿**：无登录态时 `xfl doctor` 五项硬检查全部通过，登录态软提示报告「未发现可用登录态」，退出码 0。
- [ ] **2. login 落盘**：`xfl login "https://aipoju.com/docx/<camp>/<token>"`，在弹出的 Edge 中手动登录后回终端按 Enter；`~/.xf-lark/storage/default.json` 生成，文件权限为 0600，内容为 Playwright 原生 `{cookies, origins}` 结构。
- [ ] **3. legacy 登录态兼容**：把 Python 版仅含 localStorage 的 `aipoju_storage.json` 经 `--storage` 传入一次 get，能正常进入登录流程不报「不含任何 cookie 或 localStorage」。

## 真实文档下载

- [ ] **4. 图片密集 ZIP**：对 Agent Skills 锤炼营手册级文档执行 get，产出 ZIP 体积与 Python 版同量级（30MB+），报告打印 ZIP 条目数，`.tmp-*` 无残留。
- [ ] **5. 纯文本 Markdown**：对无图文档执行 get，产出 `.md` 且 UTF-8 校验通过。
- [ ] **6. 无权限失败停下**：对本人无权限（或随机 token）的链接执行 get，明确报错停下、退出码 1，无 `.tmp-*` 与半成品正式文件，报告与控制台中的能力 URL 均脱敏为 `REDACTED`。实测注（2026-11 随机 token 链接）：无效文档上扩展按钮仍可能被注入，失败点可能是按钮轮询耗尽或下载产物超时，两种路径都安全失败不残留。
- [ ] **7. 重跑 SKIP**：对第 4 项同一清单再跑一次 batch，已存在条目全部 SKIP 且不弹出重复下载，跳过数与已有文件数一致。
- [ ] **8. 碰撞命名**：两个不同直传链接产出同名文档时，第二个改存 `<词干>_<campId 前8>.zip`，旧文件保留。
- [ ] **9. batch 双格式**：`.md` 三正则清单与 `.json` 白名单清单各跑一次，月份/offset/limit 过滤生效，`xf-lark-report.md` 的成功失败计数与实际文件一致。

## 中断与打包

- [ ] **10. Ctrl+C**：图片密集文档下载途中按 Ctrl+C，退出码 130，Edge 进程与 `XF_LARK_TEMP`（或系统临时目录）下的 `xfl-profile-*` 目录被清理，报告标注「被中断」。
- [ ] **11. pack 与双 bin**：`npm pack --dry-run` 清单含 27 个扩展 dist 文件且不含 test/、storage/、profiles/；`npm link`（或全局安装）后 `xfl --version` 与 `xf-lark --version` 都输出 0.1.0。
