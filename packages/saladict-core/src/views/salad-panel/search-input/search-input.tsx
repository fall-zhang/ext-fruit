import type { FC } from 'react'
import { useRef, useLayoutEffect, useMemo, useEffect, useState } from 'react'
import './search-input.scss'
export interface SearchBoxProps {
  /** Search box text */
  text: string
  /** Focus search box */
  /** Show suggest panel when typing */
  enableSuggest: boolean
  onInput: (text: string) => any
  /** Start searching */
  onSearch: (text: string) => any
}

/**
 * Search box
 */
export const SearchBox: FC<SearchBoxProps> = props => {
  // Textarea also shares the text so only replace here
  const text = useMemo(() => props.text.replace(/\s+/g, ' '), [props.text])

  const [isExpand, setIsExpand] = useState<boolean>(false)

  const [isShowSuggest, setIsShowSuggest] = useState<boolean>(false)
  function onShowSuggest (state:boolean) {
    setIsShowSuggest(Boolean(props.enableSuggest && text && state))
  }

  const hasTypedRef = useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestRef = useRef<HTMLDivElement>(null)

  const searchText = (text: string) => {
    hasTypedRef.current = false
    onShowSuggest(false)
    props.onSearch(typeof text === 'string' ? text : props.text)
    // focusInput()
    inputRef.current?.focus()
  }

  // const checkFocus = () => {
  //   // focusInput()
  //   inputRef.current?.focus()
  // }

  // useEffect is not quick enough on popup panel.
  // useLayoutEffect(checkFocus, [])
  // On in-page panel, layout effect only works on the first time.
  // useEffect(checkFocus, [])

  return (
    <>
      <div className={'menuBar-SearchBox_Wrap text-neutral-800 p-2'}>
        <input
          type="text"
          className="menuBar-SearchBox bg-neutral-400"
          key="search-box"
          ref={inputRef}
          autoFocus
          onChange={e => {
            props.onInput(e.currentTarget.value)
            onShowSuggest(true)
          }}
          onKeyDown={e => {
            // prevent page hot keys
            e.stopPropagation()

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
        {/* <SuggestPanel
          open={isShowSuggest}
          text={text}
        /> */}
      </div>
      {/* <SearchBtn t={props.t} onClick={() => searchText(props.text)} /> */}
    </>
  )
}
