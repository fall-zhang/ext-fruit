import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { SaladBowlProps } from './SaladBowl'
import { SaladBowl } from './SaladBowl'
import saladBolStyle from './SaladBowl.shadow.scss?raw'
import { cn } from '@P/ui/utils'
import root from 'react-shadow'
import { createSelectTextStream } from './utils/select-text-observer'

/**
 * 监听页面的事件，唤出 salad 页面
 * Detach from DOM when not visible.
 */
export const SaladBowlListen: FC = () => {
  const [posX, setPosX] = useState(-100)
  const [posY, setPosY] = useState(-100)
  const [isHover, setHover] = useState(false)
  useEffect(() => {
    const selectionEvent = createSelectTextStream({
      touchMode: false,
      doubleClickDelay: 300,
    }).subscribe(state => {
      console.log('⚡️ line:21 ~ state: ', state)
    })
    return () => {
      selectionEvent.unsubscribe()
    }
  }, [])

  const bowlProps: SaladBowlProps = {
    watchSelection: false,
    x: posX,
    y: posY,
    enableHover: true,
    onHover: setHover,
    onActive (): void {
      // 启动 panel
    },
  }
  return (
    <root.div
      id="saladict-saladbowl-root"
      className={cn('salad-bowl isAnimate')}
    >
      <style>{saladBolStyle}</style>
      <SaladBowl {...bowlProps} />
    </root.div>
  )
}
