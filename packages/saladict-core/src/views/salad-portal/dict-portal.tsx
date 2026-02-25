import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import { SALADICT_PANEL } from '@P/saladict-core/src/core/saladict-state'

import clsx from 'clsx'
import { useDictStore } from '../../store'
import { DictPanel, type DictPanelProps } from '../DictPanel/DictPanel'
import ShadowPortal, { defaultTimeout } from './shadow-portal'

export interface DictPanelPortalProps extends DictPanelProps {
  show: boolean
  withAnimation: boolean
  darkMode: boolean
  panelCSS: string
}

export const DictPanelPortal: FC = () => {
  const props = useDictStore(store => {
    return {
      show: store.isShowDictPanel,
      coord: store.dictPanelCoord,
      takeCoordSnapshot: store.wordEditor.isShow,
      width: store.config.panelWidth,
      height: store.panelHeight,
      maxHeight: store.panelMaxHeight,
      fontSize: store.config.fontSize,
      withAnimation: store.config.animation,
      panelCSS: store.config.panelCSS,
      darkMode: store.config.darkMode,
      dragStartCoord: store.dragStartCoord,
    }
  })
  const {
    show: showProps,
    panelCSS,
    withAnimation,
    darkMode,
    ...restProps
  } = props

  const showRef = useRef(showProps)
  const [show, setShow] = useState(showProps)

  useUpdateEffect(() => {
    setShow(showProps)
  }, [showProps])

  // Restore if panel was hidden before snapshot,
  // otherwise ignore.
  useUpdateEffect(() => {
    if (props.takeCoordSnapshot) {
      showRef.current = show
    } else if (!showRef.current) {
      setShow(false)
    }
  }, [props.takeCoordSnapshot])

  return (
    <ShadowPortal
      id="saladict-dictpanel-root"
      head={<style>{import('./DictPanel.shadow.scss?raw').toString()}</style>}
      shadowRootClassName={SALADICT_PANEL}
      innerRootClassName={clsx({ isAnimate: withAnimation, darkMode })}
      panelCSS={panelCSS}
      in={show}
      timeout={props.withAnimation ? defaultTimeout : 0}
    >
      {() => <DictPanel
        menuBar={undefined}
        mtaBox={undefined}
        dictList={undefined}
        waveformBox={undefined}
        onDragEnd={ () => {
          throw new Error('Function not implemented.')
        }} {...restProps} />}
    </ShadowPortal>
  )
}

export default DictPanelPortal
