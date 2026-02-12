import type { FC } from 'react'
import { useRef, useLayoutEffect, useMemo, useEffect, useState } from 'react'
import type { TFunction } from 'i18next'

import { SuggestWord } from './Suggest'
import { SearchBtn } from './MenubarBtns'

export interface SearchBoxProps {
  t: TFunction
  /** Search box text */
  text: string
  /** Focus search box */
  shouldFocus: boolean
  /** Show suggest panel when typing */
  enableSuggest: boolean
  onInput: (text: string) => any
  /** Start searching */
  onSearch: (text: string) => any

  onHeightChanged: (height: number) => void
}

/**
 * Search box
 */
export const SearchBox: FC<SearchBoxProps> = props => {
  // Textarea also shares the text so only replace here
  const text = useMemo(() => props.text.replace(/\s+/g, ' '), [props.text])

  const [isExpand, setIsExpand] = useState<boolean>(false)


  const [isShowSuggest, setIsShowSuggest] = useState<boolean>()
  function onShowSuggest (state:boolean) {
    setIsShowSuggest(Boolean(props.enableSuggest && text && state))
  }

  const hasTypedRef = useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestRef = useRef<HTMLDivElement>(null)

  const focusInput = useRef(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      // Although search box is selected on focus event
      // this is needed as the box may be focused initially.
      inputRef.current.select()
    }
  }).current

  const searchText = (text: unknown) => {
    hasTypedRef.current = false
    onShowSuggest(false)
    props.onSearch(typeof text === 'string' ? text : props.text)
    focusInput()
  }

  const checkFocus = () => {
    if (props.shouldFocus && !hasTypedRef.current && !isShowSuggest) {
      focusInput()
    }
  }

  // useEffect is not quick enough on popup panel.
  useLayoutEffect(checkFocus, [])
  // On in-page panel, layout effect only works on the first time.
  useEffect(checkFocus, [props.text])

  return (
    <>
      <div className={`menuBar-SearchBox_Wrap${isExpand ? ' isExpand' : ''}`}>
        <input
          type="text"
          className="menuBar-SearchBox"
          key="search-box"
          ref={inputRef}
          onChange={e => {
            props.onInput(e.currentTarget.value)
            onShowSuggest(true)
          }}
          onKeyDown={e => {
            // prevent page hot keys
            e.nativeEvent.stopPropagation()

            hasTypedRef.current = true
            if (e.key === 'ArrowDown') {
              const firstSuggestBtn =
                suggestRef.current && suggestRef.current.querySelector('button')
              if (firstSuggestBtn) {
                firstSuggestBtn.focus()
              } else {
                onShowSuggest(true)
              }
              e.preventDefault()
              e.stopPropagation()
            } else if (e.key === 'Enter') {
              searchText(props.text)
            }
          }}
          onFocus={event => {
            event.currentTarget.select()
            setIsExpand(true)
          }}
          onBlur={() => setIsExpand(false)}
          value={text}
        />
        {isShowSuggest && (
          <div className="menuBar-SearchBox_Suggests">
            <SuggestWord
              text={text}
              onSelect={searchText}
              onFocus={() => onShowSuggest(true)}
              onBlur={() => onShowSuggest(false)}
              onArrowUpFirst={focusInput}
              onClose={focusInput}
              onHeightChanged={props.onHeightChanged}
            />
          </div>
        )}
      </div>
      <SearchBtn t={props.t} onClick={searchText} />
    </>
  )
}
