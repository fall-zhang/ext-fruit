## trans-api

各个 API 的详情可查看 [DICT_STATE](./DICT_STATE.md)

主要支持语言：

en,    zh-CN,      zh-TW,     ja,     ko, fr,   de, es
英语，中文（简体），中文（繁体），日语，韩文，法文，德语，西班牙语


- 不应该包含视图，或者任何翻译 API 以外的内容
- 所有文件夹都包含以下内容
  - _locales.json 提供语言的名称
  - api-atom 提供拆分各个 API 的多个原子化的方法
    - getFetchRequest 获取当前请求的 Request
    - handleFetchRes 对 fetch 的结果进行处理
      - 该模块用户可自定义某个 IP 的实现
    - getDictSrc 获取当前单词翻译的源地址
  - type.ts 该语言的返回结果类型
  - auth （可选）用于认证
- 一系列请求相关工具
  - request-to-axios 将 fetch 的请求参数转换为 axios 的参数
  - axios-to-fetch 将 axios 的请求参数转换为 fetch 的参数
  - chsToChz 将繁体中文解释为简体中文


自翻译 trans by itself

- zh-to-zh [汉典](./src/self-trans-api/zh-to-zh/zdic/engine.ts)

