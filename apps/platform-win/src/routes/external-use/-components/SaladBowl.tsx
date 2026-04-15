import { useState, type FC } from 'react'
import clsx from 'clsx'
import { SaladBowlIcon } from '@/components/icons/salad-bowl'

export interface SaladBowlProps {
  watchSelection: boolean
  /** Viewport based coordinate. */
  x: number
  /** Viewport based coordinate. */
  y: number
  /** React on hover. */
  enableHover: boolean
  /** When bowl is activated via mouse. */
  onActive: () => void
  onHover: (isHover: boolean) => void
}

/**
 * Cute little icon that pops up near the selection.
 */
export const SaladBowl: FC<SaladBowlProps> = props => {
  const [isMouseOut, setMouseOut] = useState<boolean>(false)
  return (
    <div
      className={clsx('salad-bowl', {
        enableHover: props.enableHover && !isMouseOut,
      })}
      style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
      onMouseOver={() => {
        props.enableHover && setMouseOut(true)
        props.onHover(true)
        props.onActive()
      }}
      onMouseOut={() => {
        props.onHover(false)
        setMouseOut(false)
      }}
      onClick={() => props.onActive()}
    >
      <SaladBowlIcon></SaladBowlIcon>
    </div>
  )
}
