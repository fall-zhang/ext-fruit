import type { FC, ChangeEvent, KeyboardEvent } from 'react'
import { useRef, useState, useEffect } from 'react'
import classNames from 'clsx'
import AutosizeTextarea from 'react-textarea-autosize'
import { useDictStore } from '@P/saladict-core/src/store'
import { isPopupPage, isQuickSearchPage } from '@P/saladict-core/src/core/saladict-state'
import { newWord } from '@P/saladict-core/src/dict-utils/new-word'

export interface MtaBoxProps {
  text: string
  expand: boolean,
  shouldFocus: boolean
  searchText: (text: string) => any
  onInput: (text: string) => void
  /** Expand or Shrink */
  onDrawerToggle: () => void
  onHeightChanged: (height: number) => void
}

/**
 * Multiline Textarea Drawer. With animation on Expanding and Shrinking.
 */
export const MtaBox: FC = () => {
  const props:MtaBoxProps = useDictStore(state => {
    const shouldFocus = !state.activeProfile.mtaAutoUnfold ||
        state.activeProfile.mtaAutoUnfold !== 'hide' ||
        ((state.isQSPanel || isQuickSearchPage()) && state.config.qsFocus) ||
        isPopupPage()
    return {
      text: state.text,
      expand: state.isExpandMtaBox,
      shouldFocus,
      searchText: (text:string) => {
        state.SEARCH_START({ word: newWord({ text }) })
        // dispatch({ type: 'SEARCH_START', payload: { word: newWord({ text }) } })
      },
      onInput: text => {
        // dispatch({ type: 'UPDATE_TEXT', payload: text })
      },
      onDrawerToggle: () => {
        // dispatch({ type: 'TOGGLE_MTA_BOX' })
      },
      onHeightChanged: height => {
        // dispatch({
        //   type: 'UPDATE_PANEL_HEIGHT',
        //   payload: { area: 'mtabox', height },
        // })
      },
    }
  })
  const isTypedRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [height, setHeight] = useState(0)

  const [isTyping, setIsTyping] = useState(false)

  const firstExpandRef = useRef(true)
  // useEffect(() => {
  //   if (props.expand) {
  //     if (!firstExpandRef.current || props.shouldFocus) {
  //       if (textareaRef.current) {
  //         textareaRef.current.focus()
  //         textareaRef.current.select()
  //       }
  //     }
  //     firstExpandRef.current = false
  //   }
  // }, [])

  // useEffect(() => {
  //   // could be from clipboard with delay
  //   if (
  //     props.shouldFocus &&
  //     !isTypedRef.current &&
  //     props.expand &&
  //     textareaRef.current
  //   ) {
  //     textareaRef.current.focus()
  //     textareaRef.current.select()
  //   }
  // }, [])

  // useEffect(() => {
  //   props.onHeightChanged((props.expand ? height : 0) + 12)
  // }, [height, props.expand])

  return (
    <div>
      <div
        className={classNames('mtaBox-TextArea-Wrap', { isTyping })}
        style={{ height: props.expand ? height : 0 }}
      >
        <AutosizeTextarea
          autoFocus
          ref={textareaRef}
          className="mtaBox-TextArea"
          value={props.text}
          onChange={(e:ChangeEvent<HTMLTextAreaElement>) => {
            isTypedRef.current = true
            props.onInput(e.currentTarget.value)
          }}
          onFocus={() => {
            setIsTyping(true)
          }}
          onKeyDown={(e:KeyboardEvent) => {
            // prevent page shortkeys
            e.nativeEvent.stopPropagation()

            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              props.searchText(props.text)
            }
          }}
          minRows={2}
          onHeightChange={height => setHeight(height)}
        />
      </div>
      <button className="mtaBox-DrawerBtn" onClick={props.onDrawerToggle}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 59.414 59.414"
          className={classNames('mtaBox-DrawerBtn_Arrow', {
            isExpand: props.expand,
          })}
        >
          <path d="M58 14.146L29.707 42.44 1.414 14.145 0 15.56 29.707 45.27 59.414 15.56" />
        </svg>
      </button>
    </div>
  )
}

export default MtaBox
