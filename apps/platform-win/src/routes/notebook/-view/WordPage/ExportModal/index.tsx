import type { FC } from 'react'
import type React from 'react'
import { useState, useMemo } from 'react'
import { Modal, Layout, Switch } from 'antd'
import escapeHTML from 'lodash/escape'
import type { Word } from '@P/saladict-core/src/types/word'
import { newWord } from '@P/saladict-core/src/dict-utils/new-word'

import type { LineBreakOption } from './Linebreak'
import { LineBreakMemo } from './Linebreak'
import { PlaceholderTableMemo } from './PlaceholderTable'
import { useTranslation } from 'react-i18next'

const keywordMatchStr = `%(${Object.keys(newWord()).join('|')}|contextCloze)%`

export type ExportModalTitle = 'all' | 'selected' | 'page' | ''

export interface ExportModalProps {
  title: ExportModalTitle
  rawWords: Word[]
  onCancel: (e: React.MouseEvent<any>) => any
}

export const ExportModal: FC<ExportModalProps> = props => {
  const { t, i18n } = useTranslation('wordPage')
  const lang = i18n.language
  const [template, setTemplate] = useState('%text%\n%trans%\n%context%\n')
  const [lineBreak, setLineBreak] = useState<LineBreakOption>('')
  const [escape, setEscape] = useState(false)


  const output = useMemo(() => {
    return props.rawWords.map(word =>
      template.replace(new RegExp(keywordMatchStr, 'g'), (match, k:string) => {
        if (k === 'date') {
          return new Date(word.date).toLocaleDateString(lang)
        } else if ((['trans', 'note', 'context', 'contextCloze']).includes(k)) {
          let text
          if (k === 'contextCloze' || k === 'context') {
            text = word.context
          } else {
            text = word[k] || ''
          }
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
                .map((line:string) => `<p>${line}</p>`)
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
        return word[k] || ''
      })
    ).join('\n')
  }, [props.rawWords, lang, template, lineBreak, escape])

  // useEffect(() => {
  //   const wordpageTemplate = localStorage.getItem('wordpageTemplate')
  //   if (wordpageTemplate != null) {
  //     setTemplate(wordpageTemplate || '')
  //   }
  //   const wordpageLineBreak = localStorage.getItem('wordpageLineBreak')
  //   if (wordpageLineBreak != null) {
  //     setLineBreak((wordpageLineBreak || '') as LineBreakOption)
  //   }
  // }, [])

  const exportWords = () => {
    const content = output.replace(/\r\n|\n/g, '\r\n')
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
      open={!!props.title}
      destroyOnClose={true}
      onOk={exportWords}
      onCancel={props.onCancel}
      okText={t('common:export')}
      style={{ width: '90vw', maxWidth: 1200, top: 24 }}
      width="90vw"
    >
      <Layout
        style={{ height: '70vh', maxHeight: 1000, background: 'transparent' }}
      >
        <Layout.Content style={{ display: 'flex', flexDirection: 'column' }}>
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
          <PlaceholderTableMemo t={t} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1em',
            }}
          >
            <LineBreakMemo
              t={t}
              value={lineBreak}
              onChange={value => {
                setLineBreak(value)
                // localStorage.setItem('wordpageLineBreak', value)
                if (value === 'br' || value === 'p') {
                  setEscape(true)
                  // localStorage.setItem('wordpageHTMLEscape', 'true')
                }
              }}
            />
            <Switch
              title={t('export.htmlescape.title')}
              checked={escape}
              onChange={checked => {
                setEscape(checked)
                localStorage.setItem('wordpageHTMLEscape', String(checked))
              }}
              checkedChildren={t('export.htmlescape.text')}
              unCheckedChildren={t('export.htmlescape.text')}
            />
          </div>
          <textarea
            style={{ flex: 1, width: '100%' }}
            value={template}
            onChange={({ currentTarget: { value } }) => {
              setTemplate(value)
              localStorage.setItem('wordpageTemplate', value)
            }}
          />
        </Layout.Content>
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
      </Layout>
    </Modal>
  )
}
