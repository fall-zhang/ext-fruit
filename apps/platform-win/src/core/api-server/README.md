

该核心模块后续会从 core 中移出，因为 API 模块可以做到所有应用通用，并且去除视图相关影响

迁移到 packages/salad-api 路径下


- search 不应该包含视图，或者任何翻译内容以外的格式
- 所有文件夹都包含以下内容
  - _locales 提供语言的名称
  - api-atom 提供拆分各个 API 的多个原子化的方法
  - auth （可选）用于认证
  - config 语言的默认配置
  - engine 核心模块，用于请求
  - favicon.png 该词典的官方图标
  - type.ts 该语言的返回结果类型
- 需要从 open-trans 中，将本地 LangCode 转换为对应服务器需要的 LangCode

部分翻译 API 需要进行 auth 认证

- baidu
- caiyun
- sogou
- tencent
- youdaotrans