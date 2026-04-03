import type { FC } from 'react'
import type React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Modal, Layout, Switch } from 'antd'
import escapeHTML from 'lodash/escape'
import { PlaceholderTableMemo } from './PlaceholderTable'
import { I18nContext, useTranslation } from 'react-i18next'
import type { Word } from '@/types/word'
import { newWord } from '@/utils/dict-utils/new-word'

const keywordMatchStr = `%(${Object.keys(newWord()).join('|')}|contextCloze)%`
type LineBreakOption = '' | 'n' | 'p' | 'br' | 'space'

export type ExportModalTitle = 'all' | 'selected' | 'page' | ''

export interface ExportModalProps {
  title: ExportModalTitle
  rawWords: Word[]
  onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => void
}

export const ExportModal: FC<ExportModalProps> = props => {
  const lang = useContext(I18nContext)
  const { t } = useTranslation(['wordpage', 'common'])
  const [template, setTemplate] = useState('%text%\n%trans%\n%context%\n')
  const [lineBreak, setLineBreak] = useState<LineBreakOption>('')
  const [escape, setEscape] = useState(false)

  const [output, setOutput] = useState('')

  useEffect(() => {
    setOutput(props.rawWords.map(word =>
      template.replace(new RegExp(keywordMatchStr, 'g'), (match, k) => {
        switch (k) {
          // case 'date':
          //   return new Date(word.date).toLocaleDateString(lang)
          case 'trans':
          case 'note':
          case 'context':
          case 'contextCloze': {
            const key: 'trans' | 'note' | 'context' = k === 'contextCloze' ? 'context' : k
            let text = word[key] || ''
            if (escape) {
              text = escapeHTML(text)
            }
            switch (lineBreak) {
              case 'n':
                text = text.replace(/\n|\r\n/g, '\\n')
                break
              case 'br':
                text = text.replace(/\n|\r\n/g, '<br>')
                break
              case 'p':
                text = text
                  .split(/\n|\r\n/)
                  .map(line => `<p>${line}</p>`)
                  .join('')
                break
              case 'space':
                text = text.replace(/\n|\r\n/g, ' ')
                break
              default:
                break
            }
            if (k === 'contextCloze' && word.text) {
              const matcher = new RegExp(
                word.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
                'gi'
              )
              text = text.replace(
                matcher,
                ''.padStart(word.text.length, '_')
              )
            }
            return text
          }
          default:
            // return word[k] || ''
            return ''
        }
      })
    )
      .join('\n')
    )
  }, [props.rawWords, lang, template, lineBreak, escape])

  useEffect(() => {
    const wordpageTemplate = localStorage.getItem('wordpageTemplate')
    const wordpageLineBreak = localStorage.getItem('wordpageLineBreak')
    if (wordpageTemplate) {
      setTemplate(wordpageTemplate)
    }
    // setLineBreak(wordpageLineBreak)

    // storage.local
    //   .get<{
    //   wordpageHTMLEscape: boolean
    // }>('wordpageHTMLEscape')
    //   .then(({ wordpageHTMLEscape }) => {
    //     if (wordpageHTMLEscape != null) {
    //       setEscape(wordpageHTMLEscape)
    //     }
    //   })
  }, [])

  const exportWords = () => {
    const os = 'win'

    const content = os === 'win' ? output.replace(/\r\n|\n/g, '\r\n') : output
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = URL.createObjectURL(file)
    a.download = `saladict-words-${Date.now()}.txt`
    // firefox
    a.target = '_blank'
    document.body.appendChild(a)

    a.click()
  }

  return (
    <Modal
      title={props.title ? t(`export.${props.title}`) : ' '}
      visible={!!props.title}
      onOk={exportWords}
      onCancel={props.onCancel}
      okText={t('common:export')}
      style={{ width: '90vw', maxWidth: 1200, top: 24 }}
      width="90vw"
    >
      <div
        className='h-[70vh] bg-transparent'
      >
        <div >
          <p className="export-Description">
            {t('export.description')}
            <a
              href="https://saladict.crimx.com/anki.html"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {t('export.explain')}
            </a>
          </p>
          <PlaceholderTableMemo />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1em',
            }}
          >
            <Switch
              title={t('export.htmlescape.title')}
              checked={escape}
              onChange={checked => {
                setEscape(checked)
                // storage.local.set({ wordpageHTMLEscape: checked })
              }}
              checkedChildren={t('export.htmlescape.text')}
              unCheckedChildren={t('export.htmlescape.text')}
            />
          </div>
          <textarea
            className='grow w-full'
            value={template}
            onChange={({ currentTarget: { value } }) => {
              setTemplate(value)
              // storage.sync.set({ wordpageTemplate: value })
            }}
          />
        </div>
        <Layout.Sider
          width="50%"
          style={{ paddingLeft: 24, background: 'transparent' }}
        >
          <textarea
            style={{ width: '100%', height: '100%' }}
            readOnly={true}
            value={output}
          />
        </Layout.Sider>
      </div>
    </Modal>
  )
}
