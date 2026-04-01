import { useEffect, useState, type FC, type ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@salad/ui/components/dropdown-menu'
import { getSuggests } from './suggest-api'
export interface SuggestItem {
  explain: string
  entry: string
}

export type SuggestProps = {
  open: boolean
  onClose(): void
  text: string
}

/**
 * Suggest panel offering similar words.
 */
export const SuggestPanel: FC<SuggestProps> = (props) => {
  useEffect(() => {
    getSuggests(props.text).then(res => {
      // console.log('⚡️ line:28 ~ res: ', res)
      setSuggestItems(res)
    }).catch(err => {
      // console.warn('⚡️ line:32 ~ err: ', err)
    })
  }, [props.text])
  const [suggestItems, setSuggestItems] = useState<Array<{
    entry: string
    explain: string
  }>>([])
  return <DropdownMenu open={props.open} onOpenChange={(newVal) => !newVal && props.onClose()} modal={false}>
    <DropdownMenuContent >
      {suggestItems.map(item => {
        return (<DropdownMenuItem key={item.entry} className='flex justify-between'>
          <span className="mr-1.5 text-[#f9690e]">
            {item.entry}
          </span>
          <span className="text-neutral-800 dark:text-neutral-100">
            {item.explain}
          </span>
        </DropdownMenuItem>)
      })}
    </DropdownMenuContent>
  </DropdownMenu>
}
