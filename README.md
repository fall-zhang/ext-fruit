# 沙拉查词 （个人版）

[![Version](https://img.shields.io/github/release/crimx/ext-saladict.svg?label=version)](https://github.com/crimx/ext-saladict/releases)
[![Chrome Web Store](https://badgen.net/chrome-web-store/users/cdonnmffkdaoajfknoeeecmchibpmkmg?icon=chrome&color=0f9d58)](https://chrome.google.com/webstore/detail/cdonnmffkdaoajfknoeeecmchibpmkmg?hl=en)
[![Chrome Web Store](https://badgen.net/chrome-web-store/stars/cdonnmffkdaoajfknoeeecmchibpmkmg?icon=chrome&color=0f9d58)](https://chrome.google.com/webstore/detail/cdonnmffkdaoajfknoeeecmchibpmkmg?hl=en)
[![Mozilla Add-on](https://badgen.net/amo/users/ext-saladict?icon=firefox&color=ff9500)](https://addons.mozilla.org/firefox/addon/ext-saladict/)
[![Mozilla Add-on](https://badgen.net/amo/stars/ext-saladict?icon=firefox&color=ff9500)](https://addons.mozilla.org/firefox/addon/ext-saladict/)

[![Build Status](https://travis-ci.com/crimx/ext-saladict.svg)](https://travis-ci.com/crimx/ext-saladict)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?maxAge=2592000)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg?maxAge=2592000)](https://conventionalcommits.org)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?maxAge=2592000)](https://standardjs.com/)
[![License](https://img.shields.io/github/license/crimx/ext-saladict.svg?colorB=44cc11?maxAge=2592000)](https://github.com/crimx/ext-saladict/blob/dev/LICENSE)

[【官网】](https://www.crimx.com/ext-saladict/)Chrome/Firefox 浏览器插件，网页划词翻译。

<p align="center">
  <a href="https://github.com/crimx/ext-saladict/releases/" target="_blank"><img src="https://raw.githubusercontent.com/wiki/crimx/ext-saladict/images/notebook.gif" /></a>
</p>

水果沙拉查词为沙拉查词重构版本。更新了项目架构，以及依赖升级。

## 下载

见[下载页面](https://saladict.crimx.com/download.html)。

## 改动日志

[CHANGELOG.md](./CHANGELOG.md)

## 从源码构建

> 确保运行环境 node 版本至少为 20
```bash
git clone git@github.com:crimx/ext-saladict.git
cd ext-saladict
pnpm install
yarn pdf
```

在项目根添加 `.env` 文件，参考 `.env.example` 格式（可留空如果你不需要这些词典）。

```bash
yarn build
```

在 `build/` 目录下可查看针对各个浏览器打包好的扩展包。

## 开发

见[项目贡献指南](./CONTRIBUTING-zh.md)。

## 如何向本项目贡献代码

见[项目贡献指南](./CONTRIBUTING-zh.md)。

## 声明

声明：本应用基于沙拉查词的源代码，7.20.0 版本进行重构，仅供学习交流，任何人均可免费获取产品与源码。如果认为你的合法权益收到侵犯请联系我，原作者为[crimx](https://github.com/crimx)。

沙拉查词项目为 [MIT](https://github.com/crimx/ext-saladict/blob/dev/LICENSE) 许可，因此，重构后的项目也为 MIT 协议，你可以随意使用源码，但必须附带该许可与版权声明。请勿用于任何违法犯罪行为，沙拉查词强烈谴责并会尽可能配合追究责任。对于照搬源码二次发布的套壳项目沙拉查词有责任对平台和用户发出相应的举报和提醒。

因为是个人需要，一是避免好用的查词功能无法使用，二是为了磨练技术，以及学习开发浏览器插件，所以重构该项目，如果有问题请及时指出。同时也欢迎更多人进行贡献。

## 更多截图

<p align="center">
  <a href="https://github.com/crimx/ext-saladict/releases/" target="_blank"><img src="https://github.com/crimx/ext-saladict/wiki/images/youdao-page.gif" /></a>
</p>

<p align="center">
  <a href="https://github.com/crimx/ext-saladict/releases/" target="_blank"><img src="https://github.com/crimx/ext-saladict/wiki/images/screen-notebook.png" /></a>
</p>

<p align="center">
  <a href="https://github.com/crimx/ext-saladict/releases/" target="_blank"><img src="https://github.com/crimx/ext-saladict/wiki/images/pin.gif" /></a>
</p>

## 目标浏览器

目标浏览器同 vite

## 待更新功能

- 自动 dark mode
- 打包为本地应用使用