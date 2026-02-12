import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import type { DictPanelProps } from './DictPanel'
import { DictPanel } from './DictPanel'
import { SALADICT_PANEL } from '@P/saladict-core/src/core/saladict-state'

import clsx from 'clsx'
import ShadowPortal, { defaultTimeout } from '../../components/ShadowPortal'

export interface DictPanelPortalProps extends DictPanelProps {
  show: boolean
  withAnimation: boolean
  darkMode: boolean
  panelCSS: string
}

export const DictPanelPortal: FC<DictPanelPortalProps> = props => {
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
      {() => <DictPanel {...restProps} />}
    </ShadowPortal>
  )
}

export default DictPanelPortal
