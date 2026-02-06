import type { FC, ReactNode } from 'react'
import type React from 'react'
import { useState, useEffect } from 'react'
import type {
  WikipediaResult,
  WikipediaPayload,
  LangList
} from './engine'
import {
  fetchLangList
} from './engine'
import type { ViewProps } from '../helpers'
import { useTranslation } from 'react-i18next'
import { StrElm } from '@P/saladict-core/src/components/StrElm'

export const DictWikipedia: FC<ViewProps<WikipediaResult>> = ({
  result,
  searchText,
}) => {
  const [langList, setLangList] = useState<LangList>()
  const { t } = useTranslation('content')

  useEffect(() => {
    setLangList([])
  }, [result.langSelector])

  const handleSelectChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      searchText<WikipediaPayload>({
        id: 'wikipedia',
        payload: {
          url: e.target.value,
        },
      })
    }
  }

  let langSelector: ReactNode = null
  if (langList && langList.length > 0) {
    langSelector = (
      <select onChange={handleSelectChanged} defaultValue={''}>
        <option key="" value="">
          {t('chooseLang')}
        </option>
        {langList.map(item => (
          <option key={item.url} value={item.url}>
            {item.title}
          </option>
        ))}
      </select>
    )
  } else if (result.langSelector) {
    langSelector = (
      <button
        className="dictWikipedia-LangSelectorBtn"
        onClick={async () => {
          setLangList(
            await fetchLangList(result.langSelector)
          )
        }}
      >
        {t('fetchLangList')}
      </button>
    )
  }

  return (
    <>
      <h1 className="dictWikipedia-Title">{result.title}</h1>
      {langSelector}
      <div className="dictWikipedia-Content" onClick={handleEntryClick}>
        <StrElm className="client-js" html={result.content} />
      </div>
    </>
  )
}

function handleEntryClick (e: React.MouseEvent<HTMLDivElement>) {
  const targetDOM = e.target as HTMLElement
  if (!targetDOM.classList) {
    return
  }

  let $header = targetDOM
  if (!$header.classList.contains('section-heading')) {
    $header = $header.parentElement as HTMLElement
    if (!$header || !$header.classList.contains('section-heading')) {
      return
    }
  }

  e.stopPropagation()
  e.preventDefault()

  // Toggle titles

  $header.classList.toggle('open-block')

  const $content = $header.nextElementSibling
  if ($content) {
    const pressed = $header.classList.contains('open-block').toString()
    $content.classList.toggle('open-block')
    $content.setAttribute('aria-pressed', pressed)
    $content.setAttribute('aria-expanded', pressed)
  }

  const $arrow = $header.querySelector('.mw-ui-icon-mf-arrow')
  if ($arrow) {
    $arrow.classList.toggle('mf-mw-ui-icon-rotate-flip')
  }
}

export default DictWikipedia
