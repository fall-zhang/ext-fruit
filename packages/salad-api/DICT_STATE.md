> 最近更新时间：2026 Mar 24

## 所有词典的状态

如果功能失效，会进行标注

当前共收录 X 个词典 API，共 X 个可用

### 词典 API

| 词典路径   | 名称                      | 是否可用 | 默认启用 | 需要认证 |
| ---------- | ----------------------------- | -------- | -------- | ---- |
| cobuild    | 科林斯高阶                    | ✅        | ✅        | ❌  |
| cambridge  | 剑桥词典                      | ✅        | ✅        | ❌   |
| youdao     | 有道词典                      | ✅        | ✅        |  ❌  |
| vocabulary | vocabulary                    | ✅        | ✅        |  ❌  |
| urban      | urban                         | ❌        | ❌        |  ❌  |
| zdic       | [漢典](https://www.zdic.net/) | ✅        | ✅        | ❌  |
|            |                               |          |          |      |
|            |                               |          |          |      |
|            |                               |          |          |      |

（vocabulary 可以爬取更多有用的信息）

### 需要认证的词典

| 词典名称 | 中文名称 | 是否可用 | 默认启用 |
| -------- | -------- | -------- | -------- |
| baidu    | 百度     | ✅        | ❌        |
| caiyun   | 彩云     |          | ❌        |
| youdaotrans  | 有道  |          |  ❌    |
|          |          |          |          |
|          |          |          |          |
|          |          |          |          |
|          |          |          |          |
|          |          |          |          |

// 'guoyu', // 汉语词典，不能查英文 ✅ 默认启用
// 'liangan', // 汉语词典，不能查英文 ✅ 默认启用
// 'googledict', // 当前无法爬取数据，需要更新
// "google", // 谷歌 API ❌ 需要登录

'ahdict', // 美国传统词典 ✅
'oaldict', // 牛津高阶词典 ✅
'cnki', // 知网翻译 https://dict.cnki.net/index ✅
// "etymonline",
// "eudic",
// "hjdict",
// "jikipedia",
//  "jukuu", "lexico", "longman", "macmillan", "mojidict", "naver", "renren", "sogou", "tencent", "weblio", "weblioejje", "merriamwebster", "websterlearner", "wikipedia"

### 搜索建议

当搜索一个单词的时候，需要一些相关单词，或者对输入的错误内容进行纠正

### 每日单词

每天建议一个单词

### 获取发音

对应单词，或者句子的发音

### 大模型词典

如果部署了本地大模型，可以通过本地模型来获取翻译