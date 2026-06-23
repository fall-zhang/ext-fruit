> 最近更新：2026-06-23

## 所有词典的状态

如果功能失效，会进行标注

当前共收录 X 个词典 API，共 X 个可用

### 词典  API 迁移

| 迁移状态 | 词典路径   | 名称                      | 是否可用 | 默认启用 | 免认证 |
| ---------- | ----------------------------- | -------- | -------- | ---- | ---- |
| ✅ | bing | 必应 | ✅ | ✅ | ✅ |
| ✅ | guoyu | 汉语词典 | ✅ | ✅ | ✅ |
| ✅ | ahdict | 美国传统词典 | ✅ | ✅ | ✅ |
| ❌ | baidu | 百度 | ❌ | ❌ | ❌ |
| ❌ | cambridge  | 剑桥词典                      | ✅        | ✅        | ✅  |
| ❌   | cobuild    | 科林斯高阶                    | ✅        | ✅        | ✅ |
| ❌ | vocabulary | vocabulary                    | ✅        | ✅        |  ✅  |
| ❌     | urban      | urban                         | ❌        | ❌        |  ✅  |
| ❌      | zdic       | [漢典](https://www.zdic.net/) | ✅        | ✅        | ✅ |
| ❌ | liangan | 两岸词典 | ✅ | ✅ | ✅ |
|  ❌      |     cnki  |     [CNKI 知网翻译](https://dict.cnki.net)     |   ❌    |  ❌    |  ❌ |
| ❌ | caiyun | 彩云 | ❌ | ❌ | ❌ |
| ❌ | youdaotrans | 有道 | ❌ | ❌ | ❌ |
| ❌ | google | 谷歌 | ✅ | ❌ | ❌ |
| ❌    | youdao     | 有道词典                      | ✅        | ✅        |  ✅  |
| ❌ | etymonline | etymonline | ❌ | ❌ | ❌ |
| ❌ | oaldict | 牛津高阶词典 | ❌ | ❌ | ❌ |
| ❌ | eudic |  |  |  |  |
| ❌ | hjdict |  |  |  |  |
| ❌| merriamwebster | | | | |
| ❌| weblioejje | | | | |
| ❌| weblio | | | | |
|❌ | tencent |  | | | |
|❌ | sogou | | | | |
|❌ | renren | | | | |
| ❌| naver | | | | |
| ❌ | mojidict | | | | |
| ❌ | macmillan | | | | |
| ❌| longman | | | | |
| ❌| lexico | | | | |
| ❌| jukuu | | | | |
| ❌| websterlearner | | | | |
| ❌| wikipedia | | | | |

### 搜索建议

api-word-suggest

当搜索一个单词的时候，需要一些相关单词，或者对输入的错误内容进行纠正

### 每日单词

api-today-word

每天建议一个单词

### 获取发音

api-TTS

对应单词，或者句子的发音

### example 

```ts
const transRes: SelfTransResponse = {
  engin: 'bing',
  engin: 'bing',
}
```

### 词典优化

vocabulary 可以爬取更多有用的信息

### 废弃的词典

| 词典名称 | 中文名称 | 是否可用 | 废弃原因                                  |
| -------- | -------- | -------- | ----------------------------------------- |
| caiyun   |          |          | 暂不可用                                  |
| cnki     |          |          | 当前翻译不可用，无法通过 url 控制访问内容 |
|          |          |          |                                           |
|          |          |          |                     |
|  googledict | 谷歌查词 | ❌ | 暂时不可用，无法解析 DOM |
|  jikipedia | 小鸡词典 | ❌  | 团队解散，都奔向更好的未来了 |

