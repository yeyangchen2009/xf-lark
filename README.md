# xf-lark

aipoju/飞书云文档 Markdown ZIP 下载 CLI。通过包内自带的 Cloud Document Converter
扩展（见 [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md)）驱动有头 Edge 完成
文档转换与打包，命令行主用简称 `xfl`。

> 状态：0.1.0 开发中。

## 环境与安装

（PR5 补充：Node >= 22、本机 Edge、`npm install -g xf-lark`、npx 用法）

## 使用

```bash
xfl doctor
xfl login <aipoju 链接>
xfl get <docx 链接...>
xfl batch <manifest.json | links.md>
```

有头浏览器是硬约束：运行时会弹出 Edge 窗口，不支持 headless。

## 文件与隐私

（PR5 补充：`~/.xf-lark` 数据目录、storage 登录态 0600、绝不入 git/tarball、
只下载本人有权限的文档、日志脱敏规则）

## 验收状态

（PR5 补充：支持矩阵与手动验收记录）

## 开发

（PR5 补充：`npm test` 纯函数测试、`npm run test:edge` 真实浏览器门禁、
临时目录 `F:\temp\xf-lark-tests`）
