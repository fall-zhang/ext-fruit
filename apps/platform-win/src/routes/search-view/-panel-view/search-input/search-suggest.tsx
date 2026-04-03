import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@salad/ui/components/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@P/ui/components/hover-card'
import { getSuggests } from './suggest-api'
export interface SuggestItem {
  explain: string
  entry: string
}

export type SuggestProps = {
  open: boolean
  text: string
  children: ReactNode
  onClose(): void
  onSelectSuggest(word: string): void
}

/**
 * Suggest panel offering similar words.
 */
export const SuggestPanel: FC<SuggestProps> = (props) => {
  useEffect(() => {
    if (!props.open) {
      return
    }
    getSuggests(props.text).then(res => {
      // console.log('⚡️ line:28 ~ res: ', res)
      setSuggestItems(res)
    }).catch(err => {
      // console.warn('⚡️ line:32 ~ err: ', err)
    })
  }, [props.text, props.open])
  const [suggestItems, setSuggestItems] = useState<Array<{
    entry: string
    explain: string
  }>>([])
  return <HoverCard open={props.open && suggestItems.length > 0}>
    <HoverCardTrigger onClick={ev => ev.stopPropagation()}>
      {props.children}
    </HoverCardTrigger>
    <HoverCardContent className="w-[80vw] dark:bg-neutral-900 bg-neutral-200 flex flex-col p-0 gap-1 overflow-hidden text-sm">
      {suggestItems.map(item => {
        return (<div
          key={item.entry}
          onClick={() => props.onSelectSuggest(item.entry)}
          className='flex py-1 justify-between items-center dark:bg-neutral-900 px-3 bg-neutral-100 hover:bg-neutral-300 cursor-pointer  dark:hover:bg-neutral-700' >
          <span className="mr-1.5 text-[#f9690e] shrink-0 w-20 ">
            {item.entry}
          </span>
          <span className="text-neutral-800 dark:text-neutral-100 line-clamp-3">
            {item.explain}
          </span>
        </div>)
      })}
    </HoverCardContent>
  </HoverCard>
}
