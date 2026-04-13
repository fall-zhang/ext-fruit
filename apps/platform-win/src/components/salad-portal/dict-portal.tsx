import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'

import clsx from 'clsx'
import { useDictStore } from '../../store'
import { DictPanel, type DictPanelProps } from '../DictPanel/DictPanel'
import ShadowPortal from './shadow-portal'
import { SALADICT_PANEL } from '@/config/const/saladict'
import { useConfContext } from '@/context/conf-context'

export interface DictPanelPortalProps extends DictPanelProps {
  show: boolean
  withAnimation: boolean
  darkMode: boolean
  panelCSS: string
}

export const DictPanelPortal: FC = () => {
  const config = useConfContext().config
  const props = useDictStore(store => {
    return {
      // width: store.config.panelWidth,
      // fontSize: store.config.fontSize,
      // panelCSS: store.config.panelCSS,
      // withAnimation: store.config.animation,
      // darkMode: store.config.darkMode,
      takeCoordSnapshot: store.wordEditor.isShow,
      height: store.panelHeight,
      maxHeight: store.panelMaxHeight,
      coord: store.dictPanelCoord,
      dragStartCoord: store.dragStartCoord,
    }
  })
  const {
    ...restProps
  } = props

  const showRef = useRef(false)
  const [show, setShow] = useState(false)

  useUpdateEffect(() => {
    setShow(false)
  }, [show])

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
      innerRootClassName={clsx({ isAnimate: config.animation })}
    >
      <DictPanel
        menuBar={undefined}
        mtaBox={undefined}
        dictList={undefined}
        waveformBox={undefined}
        width={config.panelWidth}
        fontSize={config.fontSize}
        onDragEnd={ () => {
          throw new Error('Function not implemented.')
        }} {...restProps} />
    </ShadowPortal>
  )
}

export default DictPanelPortal
