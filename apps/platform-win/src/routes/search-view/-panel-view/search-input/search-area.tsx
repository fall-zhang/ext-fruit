import type { KeyboardEvent } from 'react'
import { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { SuggestPanel } from './search-suggest'
import { debounce } from 'lodash'

interface ChatInputProps {
  enableSuggest: boolean
  onSend: (text: string) => void;
}

export function SearchArea ({
  enableSuggest,
  ...props
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isShowSuggest, setIsShowSuggest] = useState(false)
  const [inputText, setInputText] = useState('')

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = '40px'
      if (inputText) {
        const scrollHeight = textarea.scrollHeight
        const newHeight = Math.min(scrollHeight, 100)
        textarea.style.height = `${newHeight}px`
        textarea.style.overflowY = scrollHeight > 100 ? 'auto' : 'hidden'
      } else {
        textarea.style.overflowY = 'hidden'
      }
    }
  }, [inputText])

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsShowSuggest(false)
      props.onSend(inputText)
    }
  }
  const onSelectSuggest = (text: string) => {
    setIsShowSuggest(false)
    setInputText(text)
    props.onSend(text)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onShowSuggest = useCallback(debounce((newVal: boolean) => {
    setIsShowSuggest(newVal)
  }, 600), [])
  useEffect(() => {
    const closeSuggest = () => {
      setIsShowSuggest(false)
    }
    document.addEventListener('click', closeSuggest)
    return () => {
      document.removeEventListener('click', closeSuggest)
    }
  }, [])
  // const clickOutside = useClickOutside()
  return (
    <header className="bg-[#f7f7f7] dark:bg-[#191919] border-t border-[#d1d1d1] dark:border-[#222222] p-3 pb-safe relative" >
      <div className="flex items-end gap-3 max-w-5xl mx-auto">
        <div className="flex-1 relative">
          <SuggestPanel
            open={enableSuggest && isShowSuggest }
            onClose={() => setIsShowSuggest(false)}
            onSelectSuggest={onSelectSuggest}
            text={inputText}
          >
            <textarea
              ref={textareaRef}
              autoFocus
              rows={1}
              value={inputText}
              onFocus={event => {
                event.currentTarget.select()
              }}
              onChange={(e) => {
                setInputText(e.target.value)
                onShowSuggest(true)
              }}
              onKeyDown={handleKeyPress}
              // placeholder={t('inputPlaceholder')}
              className="w-full bg-white dark:bg-[#2a2a2a] border border-[#e0e0e0] dark:border-[#333333] rounded-md pl-3 pr-1 py-2 text-sm focus:outline-none focus:border-[#5caf9e] resize-none min-h-10 max-h-25 leading-5 dark:text-white dark:placeholder-gray-500"
              style={{ height: '40px', overflowY: 'hidden' }}
            />
          </SuggestPanel>
        </div>
      </div>
    </header>
  )
}
