# Third-Party Notices

本包在 `src/vendor/extension/dist/` 内原样分发以下第三方软件的构建产物：

- 名称：Cloud Document Converter（浏览器扩展，Feishu/Lark 云文档转 Markdown）
- 上游仓库：https://github.com/whale4113/cloud-document-converter
- 作者：Junji Lu
- 许可证：MIT（全文见 `src/vendor/extension/LICENSE`）
- 锁定版本：manifest version **1.11.0**（27 个文件，约 3.0 MB）

## 为什么包内自带扩展

下载链路依赖扩展 background 脚本把转换代码注入飞书文档 iframe 的 MAIN world，
调用页面上下文里的 `docx.intoMarkdownAST()`；Node 进程无法直接访问该函数，
纯网络监听无法替代，因此扩展 dist 作为静态资产随包分发。

## 升级流程（手动）

1. 在上游仓库确认新版本变更与许可证仍然兼容；
2. 用上游 `apps/chrome-extension/dist` 整体替换 `src/vendor/extension/dist/`；
3. 同步更新本文件的锁定版本号与 `src/vendor/extension/LICENSE`；
4. 跑 `npm run test:edge` 与真实文档手动验收，确认按钮选择器
   （`[data-CDC-aipoju-container]`、`button[data-CDC-button-type="download"]`）未变。
