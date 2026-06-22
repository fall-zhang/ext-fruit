import type { AppConfig } from '@/config/app-config'

export type CtxTranslatorId = keyof AppConfig['ctxTrans']

export type CtxTranslateResults = {
  [id in CtxTranslatorId]: string
}

/**
 * get translator result from text
 */
export function parseCtxText (text: string): CtxTranslateResults {
  const matcher = /\[:: (\w+) ::\]\n([\s\S]+?)(?=(?:\[:: \w+ ::\])|(?:-{15}))/g
  let matchResult: RegExpExecArray | null
  const result = {} as CtxTranslateResults
  while ((matchResult = matcher.exec(text)) !== null) {
    result[matchResult[1] as CtxTranslatorId] = matchResult[2].replace(
      /\n+$/g,
      ''
    )
  }
  return result
}

/**
 * Add Context translate result to text
 * @param text original text
 */
export function genCtxText (
  text: string,
  ctxTransResult: CtxTranslateResults
): string {
  const enginesWithResult = Object.keys(ctxTransResult).filter(
    (id) => ctxTransResult[id as keyof CtxTranslateResults]
  )

  if (enginesWithResult.length <= 0) {
    return text
  }

  const ctxResults =
    enginesWithResult
      .map(id => `[:: ${id} ::]\n` + ctxTransResult[id as keyof CtxTranslateResults])
      .join('\n\n') + `\n${''.padEnd(15, '-')}\n`

  if (!text) {
    return ctxResults
  }

  const matcher = /\[:: (\w+) ::\]\n([\s\S]+?)-{15}/

  if (matcher.test(text)) {
    return text.replace(matcher, ctxResults)
  }

  return text + '\n\n' + ctxResults
}
