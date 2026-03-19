import { fetch } from '@tauri-apps/plugin-http'

interface OllamaConfig {
  baseURL: string;
  model: string;
}

interface TranslateRequest {
  text: string;
  sourceLanguage?: string;
  targetLanguage: string;
  model?: string;
}

interface TranslateResponse {
  translatedText: string;
  model: string;
}

// 创建 API 配置
const createOllamaConfig = (
  baseURL: string = 'http://localhost:11434',
  model: string = 'llama2'
): OllamaConfig => ({
  baseURL,
  model,
})

// 流式翻译
const translateStream = async (
  config: OllamaConfig,
  request: TranslateRequest,
  onChunk: (chunk: string) => void
): Promise<TranslateResponse> => {
  const model = request.model || config.model
  const prompt = `Translate the following text from ${request.sourceLanguage || 'auto'} to ${request.targetLanguage}:\n\n${request.text}`

  const response = await fetch(`${config.baseURL}/api/generate`, {
    method: 'post',
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
    }),
  })

  let translatedText = ''
  const reader = response.body?.getReader()

  if (!reader) throw new Error('无法读取响应流')

  const decoder = new TextDecoder()
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(Boolean)

    for (const line of lines) {
      try {
        const json = JSON.parse(line)
        const text = json.response || ''
        translatedText += text
        onChunk(text)
      } catch (e) {
        // 忽略 JSON 解析错误
      }
    }
  }

  return {
    translatedText: translatedText.trim(),
    model,
  }
}

// 拉取模型
const pullModel = async (config: OllamaConfig, modelName: string): Promise<void> => {
  await fetch(`${config.baseURL}/api/pull`, {
    method: 'post',
    body: JSON.stringify({ name: modelName }),
  })
}

// 列出所有模型
const listModels = async (config: OllamaConfig): Promise<string[]> => {
  const response = await fetch(`${config.baseURL}/api/tags`, {
    method: 'get',
  })
  return (await response.json()).models.map((m: any) => m.name)
}

export {
  createOllamaConfig,
  translateStream,
  pullModel,
  listModels
}
export type { OllamaConfig, TranslateRequest, TranslateResponse }
