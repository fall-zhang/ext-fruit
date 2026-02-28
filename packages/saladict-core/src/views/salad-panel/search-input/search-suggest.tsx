import { useEffect, useState, type FC } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem
} from '@salad/ui/components/ui/dropdown-menu'
import { getSuggests } from '@P/saladict-core/src/utils/getSuggests'

export interface SuggestItem {
  explain: string
  entry: string
}

export type SuggestProps = {
  /** Search box text */
  open: boolean
  text:string
}

/**
 * Suggest panel offering similar words.
 */
export const SuggestPanel: FC<SuggestProps> = (props) => {
  useEffect(() => {
    getSuggests(props.text).then(res => {
      setSuggestItems(res)
    }).catch(err => {
      console.warn('⚡️ line:32 ~ err: ', err)
    })
  }, [props.text])
  const [suggestItems, setSuggestItems] = useState<Array<{
    entry:string
    explain: string
  }>>([])
  return <DropdownMenu open={props.open}>
    <DropdownMenuContent>
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
