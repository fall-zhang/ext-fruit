import type {
  CSSProperties,
  FC,
  ReactNode
} from 'react'
import {
  useRef,
  useState,
  useMemo,
  useEffect
} from 'react'
import clsx from 'clsx'
import { useUpdateEffect } from 'react-use'
// import { SALADICT_PANEL, isInternalPage } from '@/_helpers/saladict'
import { SALADICT_PANEL, isInternalPage } from '@P/saladict-core/src/core/saladict-state'
import { HoverBoxContext } from '@sala/core/src/components/HoverBox'
import { getScrollbarWidth } from '@P/saladict-core/src/utils/scrollbar-width'

export interface DictPanelProps {
  /** Update position command from uptream */
  coord: {
    x: number
    y: number
  }
  /** Take or restore position snaphot when this value changes */
  takeCoordSnapshot: boolean

  width: number
  height: number
  maxHeight: number
  fontSize: number

  menuBar: ReactNode
  mtaBox: ReactNode
  dictList: ReactNode
  waveformBox: ReactNode

  dragStartCoord: null | { x: number; y: number }
  onDragEnd: () => void
}

export const DictPanel: FC<DictPanelProps> = props => {
  const rootElRef = useRef<HTMLDivElement | null>(null)

  const [x, setX] = useState(() => reconcileX(props.width, props.coord.x))
  const [y, setY] = useState(() => reconcileY(props.height, props.coord.y))

  const userDraggedRef = useRef(false)

  const coordSnapshotRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useUpdateEffect(() => {
    if (props.takeCoordSnapshot) {
      coordSnapshotRef.current = { x, y }
    } else {
      if (coordSnapshotRef.current) {
        setX(reconcileX(props.width, coordSnapshotRef.current.x))
        setY(reconcileY(props.height, coordSnapshotRef.current.y))
      }
    }
  }, [props.takeCoordSnapshot])

  useUpdateEffect(() => {
    setX(reconcileX(props.width, props.coord.x))
    setY(reconcileY(props.height, props.coord.y))
  }, [props.coord])

  useUpdateEffect(() => {
    // only reconcile if never been dragged
    if (!userDraggedRef.current) {
      setX(x => reconcileX(props.width, x))
      setY(y => reconcileY(props.height, y))
    }
  }, [props.width, props.height])

  useEffect(() => {
    if (props.dragStartCoord) {
      userDraggedRef.current = true
    }
  }, [props.dragStartCoord])

  const dragStartPanelCoord = useMemo(
    () => (props.dragStartCoord ? { x, y } : null),
    [props.dragStartCoord]
  )

  return (
    // an extra layer for float box
    <div
      ref={rootElRef}
      className="dictPanel-FloatBox-Container saladict-theme"
    >
      <div
        className={clsx('dictPanel-Root', SALADICT_PANEL, {
          isDragging: props.dragStartCoord,
        })}
        style={{
          left: x,
          top: y,
          zIndex: isInternalPage() ? 999 : 2147483647, // for popups on options page
          width: props.width,
          height: props.height,
          '--panel-width': props.width + 'px',
          '--panel-max-height': props.maxHeight + 'px',
          '--panel-font-size': props.fontSize + 'px',
        } as CSSProperties}
      >
        <div className="dictPanel-Head">{props.menuBar}</div>
        <HoverBoxContext.Provider value={rootElRef}>
          <div
            className={`dictPanel-Body${
              getScrollbarWidth() > 0 ? ' fancy-scrollbar' : ''
            }`}
          >
            {props.mtaBox}
            {props.dictList}
          </div>
        </HoverBoxContext.Provider>
        {props.waveformBox}
        {props.dragStartCoord && (
          <div
            className="dictPanel-DragMask"
            onMouseMove={e => {
              if (dragStartPanelCoord && props.dragStartCoord) {
                e.stopPropagation()
                e.preventDefault()
                setX(e.clientX - props.dragStartCoord.x + dragStartPanelCoord.x)
                setY(e.clientY - props.dragStartCoord.y + dragStartPanelCoord.y)
              }
            }}
            onTouchMove={e => {
              if (dragStartPanelCoord && props.dragStartCoord) {
                e.stopPropagation()
                e.preventDefault()
                setX(
                  e.changedTouches[0].clientX -
                    props.dragStartCoord.x +
                    dragStartPanelCoord.x
                )
                setY(
                  e.changedTouches[0].clientY -
                    props.dragStartCoord.y +
                    dragStartPanelCoord.y
                )
              }
            }}
            onMouseOut={e => {
              if (!e.relatedTarget) {
                props.onDragEnd()
              }
            }}
            onMouseUp={props.onDragEnd}
            onTouchCancel={props.onDragEnd}
            onTouchEnd={props.onDragEnd}
          />
        )}
      </div>
    </div>
  )
}

function reconcileX (width: number, x: number): number {
  const winWidth = window.innerWidth
  let newX:number = 10
  // also counted scrollbar width
  if (x + width + 25 > winWidth) {
    newX = winWidth - 25 - width
  }

  if (x < 10) {
    newX = 10
  }

  return newX
}

function reconcileY (height: number, y: number): number {
  const winHeight = window.innerHeight
  let newY = y

  if (newY + height + 15 > winHeight) {
    newY = winHeight - 15 - height
  }

  if (newY < 15) {
    newY = 15
  }

  return y
}
