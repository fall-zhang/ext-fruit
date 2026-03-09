import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import type { FloatBoxItem } from '../FloatBox'
import { FloatBox } from '../FloatBox'

export type HoverBoxItem = FloatBoxItem

/**
 * Accept a optional root element via Context which
 * will be the parent element of the float boxes.
 * This is for bypassing z-index restriction, making sure
 * the float boxes is always on top of other elements.
 */
export const HoverBoxContext = React.createContext<
  React.RefObject<HTMLElement | null>
>({ current: null })

export interface HoverBoxProps {
  Button: FC<React.ComponentProps<'button'>>
  items: HoverBoxItem[]
  /** Compact float box */
  compact?: boolean
  /** box top offset */
  top?: number
  /** box left offset */
  left?: number
  onSelect?: (key: string, value: string) => void
  /** return false to prevent showing float box */
  onBtnClick?: () => boolean
  onHeightChanged?: (height: number) => void
}

/**
 * A button and a FloatBox that shows when hovering.
 */
export const HoverBox: FC<HoverBoxProps> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)

  const [onHoverBtn, setHoverBtn] = useState<boolean>(false)

  const [onBtnClick, setBtnClick] = useState<boolean>()

  const [onHoverBox, setHoverBox] = useState<boolean>()

  // const [showBox, showBox$] = useObservableCallback<boolean>(identity)
  const [showBox, setShowBox] = useState(false)
  const isOnBtn = showBox && onBtnClick

  const isOnBox = onHoverBox && onHoverBtn

  const isShowBox = isOnBtn || isOnBox

  const [floatBoxStyle] = useState<React.CSSProperties>(() =>
    (props.left == null
      ? {
        top: props.top == null ? 40 : props.top,
        left: '50%',
        transform: 'translateX(-50%)',
      }
      : {
        top: props.top == null ? 40 : props.top,
        left: props.left,
      })
  )

  return (
    <div className="hoverBox-Container" ref={containerRef}>
      <props.Button
        onKeyDown={e => {
          switch (e.key) {
            case 'ArrowDown':
            // Show float box or jump focus to the first item
              e.preventDefault()
              e.stopPropagation()
              if (isShowBox) {
                if (boxRef.current) {
                  const firstBtn = boxRef.current.firstElementChild
                  if (firstBtn) {
                    ;(firstBtn as HTMLButtonElement | HTMLSelectElement).focus()
                  }
                }
              } else {
                setShowBox(true)
              }
              break
            case 'Tab':
            // Jump focus to the first item
              if (!e.shiftKey && isShowBox && boxRef.current) {
                e.preventDefault()
                e.stopPropagation()
                const firstBtn = boxRef.current.firstElementChild
                if (firstBtn) {
                  ;(firstBtn as HTMLButtonElement | HTMLSelectElement).focus()
                }
              }
              break
          }
        }}
        onMouseOver={() => setHoverBtn(true)}
        onMouseOut={() => setHoverBtn(false)}
        onClick={() => {
          setBtnClick(state => !state)
        }}
      />
      <div className="hoverBox-FloatBox" style={floatBoxStyle}>
        <FloatBox
          ref={boxRef}
          compact={props.compact}
          list={props.items}
          onFocus={() => { setHoverBtn(true) }}
          onBlur={() => setHoverBtn(false)}
          onMouseOver={() => setHoverBox(true)}
          onMouseOut={() => setHoverBox(false)}
          onArrowUpFirst={container =>
            (container.lastElementChild as HTMLButtonElement).focus()
          }
          onArrowDownLast={container =>
            (container.firstElementChild as HTMLButtonElement).focus()
          }
          onSelect={props.onSelect}
          onHeightChanged={props.onHeightChanged}
          onClose={() => setShowBox(false)}
        />
      </div>
    </div>
  )
}
