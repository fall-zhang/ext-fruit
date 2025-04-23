import React, { FC } from 'react'
import { LexicoResult, LexicoResultLex, LexicoResultRelated } from './engine'
import { ViewPorps } from '@P/trans-api/src/helpers'
import { StrElm } from '@/components/StrElm'

export const DictLexico: FC<ViewPorps<LexicoResult>> = ({ result }) => {
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
  // let $info = $target.classList?.contains('moreInfo')
  //   ? $target
  //   : $target.parentElement?.classList?.contains('moreInfo')
  //     ? $target.parentElement
  //     : null
  let $info = null
  if ($target.classList?.contains('moreInfo')) {
    $info = $target
  } else if ($target.parentElement?.classList?.contains('moreInfo')) {
    $info = $target.parentElement
  }
  if ($info) {
    $info.classList.toggle('active')
  }
}
