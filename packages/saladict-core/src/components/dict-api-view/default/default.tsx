import { getTTS } from '@P/api-server/trans-api/google/engine'
import type { ViewProps } from '@P/api-server/types'
import type { DictID } from '@P/api-server/types/all-dict-conf'
import type { FC } from 'react'
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useRef
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { MachineTranslateResult } from '../../MachineTrans/engine'
import { Speaker } from '../../Speaker'
import type { Language } from '@P/open-trans/languages'

const rtlLangs = new Set([
  'ar', // Arabic
  'ara', // Arabic
  'az', // Azerbaijani
  'fa', // Persian
  'he', // Hebrew
  'iw', // Hebrew
  'ku', // Kurdish
  'ug', // Uighur
  'ur', // Urdu
])

const TSpeaker = React.memo<{
  result: MachineTranslateResult<DictID>
  source: 'searchText' | 'trans'
}>(({ result, source }) => (
  <Speaker
    src={
      result[source].tts === '#'
        ? () => {
          const lang:Language = source === 'trans' ? result.tl : result.sl
          return getTTS(result[source].paragraphs.join(' '), lang)
        }
        : result[source].tts
    }
  />
))

/** text with a speaker at the beginning */
const TText = React.memo<{
  result: MachineTranslateResult<DictID>
  source: 'searchText' | 'trans'
  lang: string
}>(({ result, source, lang }) => (
  <div className={'MachineTrans-Lines'}>
    <TSpeaker result={result} source={source} />
    {result[source].paragraphs.map((line, i) => (
      <p key={i} className={`MachineTrans-lang-${lang}`}>
        {line}
      </p>
    ))}
  </div>
))

const TTextCollapsable = React.memo<{
  result: MachineTranslateResult<DictID>
  source: 'searchText' | 'trans'
  lang: string
}>(({ result, source, lang }) => {
  const [collapse, setCollapse] = useState(false)
  const expand = useCallback(() => setCollapse(false), [setCollapse])

  const containerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (collapse || !containerRef.current) return

    // count lines

    if (containerRef.current.querySelectorAll('p').length > 1) {
      // multiple paragraphs
      setCollapse(true)
      return
    }

    const text = containerRef.current.querySelector('p span')
    if (text && text.getClientRects().length > 1) {
      // multiple lines
      setCollapse(true)
    }
  }, [])

  return (
    <div ref={containerRef} className={'MachineTrans-Lines'}>
      <TSpeaker result={result} source={source} />
      {collapse
        ? (
          <div
            className={`MachineTrans-Lines-collapse MachineTrans-lang-${lang}`}
          >
            <button onClick={expand}>
              {result[source].paragraphs.join(' ')}
            </button>
          </div>
        )
        : (
          result[source].paragraphs.map((line, i) => (
            <p key={i} className={`MachineTrans-lang-${lang}`}>
              <span>{line}</span>
            </p>
          ))
        )}
    </div>
  )
})

export type MachineTransProps = ViewProps<MachineTranslateResult<DictID>>

/** Template for machine translations */
export const MachineTrans: FC<MachineTransProps> = props => {
  const { tl, sl } = props.result
  const [slState, setSlState] = useState<
    MachineTransProps['result']['slInitial']
  >(props.result.slInitial)

  if (props.result.requireCredential) {
    return <RenderCredential />
  }

  return (
    <div
      className={
        rtlLangs.has(sl) || rtlLangs.has(tl)
          ? 'MachineTrans-has-rtl'
          : undefined
      }
    >
      <div className="MachineTrans-Text">
        {slState === 'full' && (
          <TText result={props.result} source="searchText" lang={sl} />
        )
        }
        {slState === 'collapse' && (
          <TTextCollapsable
            result={props.result}
            source="searchText"
            lang={sl}
          />
        ) }
        <TText result={props.result} source="trans" lang={tl} />
      </div>
    </div>
  )
}

const RenderCredential:FC = (props) => {
  const { t } = useTranslation('content')
  return (<>
    <Trans message={t('machineTrans.login')}>
      <a
        href={browser.runtime.getURL('options.html?menuselected=DictAuths')}
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        {t('machineTrans.dictAccount')}
      </a>
    </Trans>
  </>
  )
}
