
import type { FC } from 'react'
import type React from 'react'
import { useState, useEffect } from 'react'
import { useUpdateEffect } from 'react-use'

import { getWordsByText, deleteWords, saveWord } from '@P/saladict-core/src/core/database'
import type { AppConfig } from '@P/saladict-core/src/app-config'

import type { CtxTranslateResults } from '@P/saladict-core/src/utils/translateCtx'
import { genCtxText, translateCtxs } from '@P/saladict-core/src/utils/translateCtx'

import { WordCards } from './WordCards'
import type {
  WordEditorPanelProps,
  WordEditorPanelBtns
} from './WordEditorPanel'
import {
  WordEditorPanel
} from './WordEditorPanel'
import { CtxTransList } from './CtxTransList'
import { useTranslation } from 'react-i18next'
import { useOptContext } from '@P/saladict-core/src/context/opt-context'
import type { Word } from '@P/saladict-core/src/types/word'
import { useNavigate } from '@tanstack/react-router'

export interface NotesProps {
  containerWidth:WordEditorPanelProps['containerWidth']
  wordEditor: {
    word: Word
    translateCtx: boolean
  }
  /** dicts to translate context */
  ctxTrans: AppConfig['ctxTrans']

  onClose: () => void
}


export const Notes: FC<NotesProps> = props => {
  const { t } = useTranslation(['common', 'content'])
  const [isDirty, setDirty] = useState(false)
  const [isShowCtxTransList, setShowCtxTransList] = useState(false)
  // const optContext = useOptContext()
  const navigate = useNavigate()
  const [word, setWord] = useState(props.wordEditor.word)
  const [relatedWords, setRelatedWords] = useState<Word[]>([])

  const [ctxTransConfig, setCtxTransConfig] = useState(props.ctxTrans)
  // const ctxTransConfig = props.ctxTrans

  const [ctxTransResult, setCtxTransResult] = useState(() =>
    Object.keys(props.ctxTrans).reduce((result, id) => {
      // eslint-disable-next-line no-param-reassign
      result[id] = ''
      return result
    }, {} as CtxTranslateResults)
  )
  function getRelatedWords (word:Word) {
    getWordsByText({
      area: 'notebook',
      text: word.text,
    })
      .then(words => {
        setRelatedWords (words.filter(({ date }) => date !== word.date))
      })
      .catch(() => [])
  }

  useEffect(() => {
    if (props.wordEditor.translateCtx) {
      translateCtxs(word.context || word.text, ctxTransConfig)
    }
  }, [ctxTransConfig, props.wordEditor.translateCtx, word])

  useEffect(() => {
    getRelatedWords(word)
  }, [word])

  useUpdateEffect(() => {
    setWord({
      ...word,
      trans: genCtxText(word.trans, ctxTransResult),
    })
  }, [ctxTransResult])

  const closeEditor = () => {
    if (!isDirty || confirm(t('content:wordEditor.closeConfirm'))) {
      props.onClose()
    }
  }

  const formChanged = ({
    currentTarget,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDirty(true)
    setWord({
      ...word,
      [currentTarget.name]: currentTarget.value,
    })
  }

  const panelBtns: WordEditorPanelBtns = [
    {
      type: 'normal',
      title: t('content:transContext'),
      onClick: () => translateCtxs(word.context || word.text, ctxTransConfig),
    },
    {
      type: 'normal',
      title: t('content:neverShow'),
      onClick: () => {
        console.log('jump to options page')
        navigate({
          to: '/configs/',
        })
      },
    },
    {
      type: 'normal',
      title: t('cancel'),
      onClick: closeEditor,
    },
    {
      type: 'primary',
      title: t('save'),
      onClick: () => {
        saveWord({
          area: 'notebook',
          word,
        })
          .then(props.onClose)
          .catch(console.error)
      },
    },
  ]

  const [ankiCardId, setAnkiCardId] = useState<number | undefined>()

  if (ankiCardId) {
    panelBtns.unshift({
      type: 'normal',
      title: t('content:updateAnki.title'),
      onClick: async () => {
        let status = 'content:updateAnki.success'
        try {
          console.log('update anki word', { cardId: ankiCardId, word })
          // if(ankiSyncEnable){
          // this.updateWord(ankiCardId, word)
          // }
        } catch (e) {
          if (process.env.DEBUG) {
            console.error(e)
          }
          status = 'content:updateAnki.failed'
        }
        browser.notifications.create({
          type: 'basic',
          eventTime: Date.now() + 2000,
          iconUrl: browser.runtime.getURL('assets/icon-128.png'),
          title: 'Saladict',
          message: t(status),
        })
      },
    })
  }

  return (
    <>
      <WordEditorPanel
        containerWidth={props.containerWidth}
        title={t('content:wordEditor.title')}
        btns={panelBtns}
        onClose={closeEditor}
      >
        <div className="wordEditorNote-Container">
          <div className="wordEditorNote">
            <label htmlFor="wordEditorNote_Word">{t('note.word')}</label>
            <input
              type="text"
              name="text"
              id="wordEditorNote_Word"
              value={word.text}
              onChange={formChanged}
              onKeyDown={stopPropagation}
            />
            <label htmlFor="wordEditorNote_Context">{t('note.context')}</label>
            <textarea
              rows={3}
              name="context"
              id="wordEditorNote_Context"
              value={word.context}
              onChange={formChanged}
              onKeyDown={stopPropagation}
            />
            <div className="wordEditorNote_LabelWithBtn">
              <label htmlFor="wordEditorNote_Trans">
                {t('note.trans')}
              </label>
              <button onClick={() => setShowCtxTransList(true)}>
                {t('content:wordEditor.chooseCtxTitle')}
              </button>
            </div>
            <textarea
              rows={10}
              name="trans"
              id="wordEditorNote_Trans"
              value={word.trans}
              onChange={formChanged}
              onKeyDown={stopPropagation}
            />
            <p className="wordEditorNote_Help">
              {t('content:wordEditor.ctxHelp')}
            </p>
            <label htmlFor="wordEditorNote_Note">{t('note.note')}</label>
            <textarea
              rows={5}
              name="note"
              id="wordEditorNote_Note"
              value={word.note}
              onChange={formChanged}
              onKeyDown={stopPropagation}
            />
            <label htmlFor="wordEditorNote_SrcTitle">
              {t('note.srcTitle')}
            </label>
            <input
              type="text"
              name="title"
              id="wordEditorNote_SrcTitle"
              value={word.title}
              onChange={formChanged}
              onKeyDown={stopPropagation}
            />
            <label htmlFor="wordEditorNote_SrcLink">{t('note.srcLink')}</label>
            <input
              type="text"
              name="url"
              id="wordEditorNote_SrcLink"
              value={word.url}
              onChange={formChanged}
              onKeyDown={stopPropagation}
            />
            <label htmlFor="wordEditorNote_SrcFavicon">
              {t('note.srcFavicon')}
              {word.favicon
                ? (
                  <img
                    className="wordEditorNote_SrcFavicon"
                    src={word.favicon}
                    alt={t('note.srcTitle')}
                  />
                )
                : null}
            </label>
            <input
              type="text"
              name="favicon"
              id="wordEditorNote_SrcFavicon"
              value={word.favicon}
              onChange={formChanged}
              onKeyDown={stopPropagation}
            />
          </div>
          {relatedWords && relatedWords.length > 0 && (
            <WordCards
              words={relatedWords}
              onCardDelete={word => {
                if (window.confirm(t('content:wordEditor.deleteConfirm'))) {
                  deleteWords({
                    area: 'notebook',
                    keyList: [word.date],
                  }).then(res => {
                    getRelatedWords(word)
                  }).catch(err => {
                    console.warn('delete word failed')
                  })
                }
              }}
            />
          )}
        </div>
      </WordEditorPanel>

      <WordEditorPanel
        containerWidth={props.containerWidth - 100}
        title={t('content:wordEditor.chooseCtxTitle')}
        onClose={() => setShowCtxTransList(false)}
        btns={[
          {
            type: 'normal',
            title: t('content:transContext'),
            onClick: () => translateCtxs(word.context || word.text, ctxTransConfig),
          },
        ]}
      >
        <CtxTransList
          word={word}
          ctxTransConfig={ctxTransConfig}
          ctxTransResult={ctxTransResult}
          onNewCtxTransConfig={(id, enabled) => {
            setCtxTransConfig(ctxTransConfig => ({
              ...ctxTransConfig,
              [id]: enabled,
            }))
          }}
          onNewCtxTransResult={(id, content) => {
            setCtxTransResult(ctxTransResult => ({
              ...ctxTransResult,
              [id]: content,
            }))
          }}
        />
      </WordEditorPanel>
    </>
  )
}

function stopPropagation (e: React.KeyboardEvent<HTMLElement>) {
  e.stopPropagation()
  e.nativeEvent.stopPropagation()
}
