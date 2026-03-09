type UseScenario = {
  type: 'word'
  description: '单个单词查询'
} | {
  type: 'sentence'
  description: '一句话的查询'
} | {
  type: 'explain'
  description: '自解释，例如 English to English'
}

