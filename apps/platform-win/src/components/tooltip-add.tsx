import { Tooltip, TooltipContent, TooltipTrigger } from '@P/ui/components/tooltip'
import { useState, type FC, type ReactNode } from 'react'

export const OptTooltip: FC<{
  children: ReactNode
  optText: string
  optDoneText: string
}> = (props) => {
  const [tipState, setTipState] = useState<'show-tip' | 'show-success'>('show-tip')
  const [tipShow, setTipShow] = useState(false)

  return <Tooltip
    delayDuration={400}
    open={tipShow} onOpenChange={(open) => {
      if (tipState === 'show-tip') {
        setTipShow(open)
      }
    }}>
    <TooltipTrigger
      onClick={() => {
        setTipShow(true)
        setTipState('show-success')
        setTimeout(() => {
          setTipShow(false)
          setTipState('show-tip')
        }, 900)
      }}>
      <button >
        {props.children}
      </button>
    </TooltipTrigger>
    <TooltipContent >
      <p>{
        tipState === 'show-tip'
          ? props.optText
          : props.optDoneText
      }</p>
    </TooltipContent>
  </Tooltip>
}
