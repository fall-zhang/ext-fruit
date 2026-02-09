import React, { FC, useState } from 'react'
// import { AppConfig } from '@/app-config'
import { AppConfig } from '@P/saladict-core/src/app-config'
// import {
//   CtxTranslatorId,
//   CtxTranslateResults,
//   translateCtx
// } from '@/_helpers/translateCtx'
import { CtxTranslateResults, CtxTranslatorId, translateCtx } from '@P/saladict-core/src/utils/translateCtx'
import { Word } from '@P/saladict-core/src/store/selection/types'
// import { Word } from '@P/saladict-core/src/dict-utils/new-word'

export interface CtxTransListProps {
  word: Word
  ctxTransConfig: AppConfig['ctxTrans']
  ctxTransResult: CtxTranslateResults
  onNewCtxTransConfig: (id: CtxTranslatorId, enabled: boolean) => void
  onNewCtxTransResult: (id: CtxTranslatorId, content: string) => void
}

export const CtxTransList: FC<CtxTransListProps> = props => {
  const [isLoading, setIsLoading] = useState(() => {
    const result:Record<keyof AppConfig['ctxTrans'], boolean> = {
      baidu: false,
      caiyun: false,
      google: false,
      sogou: false,
      tencent: false,
      youdaotrans: false
    }
    Object.keys(props.ctxTransConfig).forEach((key, index) => {
      result[key as keyof AppConfig['ctxTrans']] = false
    })
    return result
  }

  )

  const onTicked = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = evt.currentTarget.dataset
    if (
      name &&
      Object.prototype.hasOwnProperty.call(props.ctxTransConfig, name)
    ) {
      props.onNewCtxTransConfig(
        name as CtxTranslatorId,
        evt.currentTarget.checked
      )

      const text = props.word.context || props.word.text
      if (evt.currentTarget.checked && text) {
        setIsLoading(isLoading => ({
          ...isLoading,
          [name]: true
        }))

        const result = await translateCtx(text, name as CtxTranslatorId)

        setIsLoading(isLoading => ({
          ...isLoading,
          [name]: false
        }))

        props.onNewCtxTransResult(name as CtxTranslatorId, result)
      } else {
        props.onNewCtxTransResult(name as CtxTranslatorId, '')
      }
    }
  }

  return (
    <ul className="ctxTransList">
      {Object.keys(props.ctxTransResult).map(name => (
        <li key={name} className="ctxTransItem">
          <div className="ctxTransItem-Head">
            <h1 className="ctxTrans-Title">
              <input
                type="checkbox"
                checked={props.ctxTransConfig[name]}
                id={'ctx-' + name}
                data-name={name}
                onChange={onTicked}
              />
              <label htmlFor={'ctx-' + name}>{name}</label>
            </h1>
            {isLoading[name] && (
              <div className="ctxTrans-Loader">
                <div />
                <div />
                <div />
                <div />
                <div />
              </div>
            )}
          </div>
          <p className="ctxTrans-Content">{props.ctxTransResult[name]}</p>
        </li>
      ))}
    </ul>
  )
}
