import type { FC } from 'react'
import type React from 'react'
import { StrElm } from '@/components/StrElm'
import type { LexicoResult, LexicoResultLex, LexicoResultRelated } from '@/core/api-server/trans-api/lexico/engine'
import type { ViewProps } from '../type'

export const DictLexico: FC<ViewProps<LexicoResult>> = ({ result }) => {
  switch (result.type) {
    case 'lex':
      return renderLex(result)
    case 'related':
      return renderRelated(result)
    default:
      return null
  }
}

function renderLex (result: LexicoResultLex) {
  return (
    <StrElm
      className="dictLexico-Lex"
      tag='p'
      onClick={onLexClick}
      html={result.entry}
    />
  )
}

function renderRelated (result: LexicoResultRelated) {
  return (
    <>
      <p>Did you mean:</p>
      <ul className="dictLexico-Related">
        {result.list.map((item, i) => (
          <li key={i}>
            <a
              rel="nofollow noopener noreferrer"
              target="_blank"
              href={item.href}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

export default DictLexico

function onLexClick (e: React.MouseEvent): void {
  const $target = e.target as Element
  let $info: Element | null = null

  if ($target.classList?.contains('moreInfo')) {
    $info = $target
  } else if ($target.parentElement?.classList?.contains('moreInfo')) {
    $info = $target.parentElement
  }

  if ($info) {
    $info.classList.toggle('active')
  }
}
