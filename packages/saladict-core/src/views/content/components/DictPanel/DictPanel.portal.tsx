import React, { FC, useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import classnames from 'classnames'
import { useRefFn } from 'observable-hooks'
import { ShadowPortal, defaultTimeout } from '@/components/ShadowPortal'
import { DictPanel, DictPanelProps } from './DictPanel'
import { SALADICT_PANEL } from '@P/saladict-core/src/core/saladict-state'

import styleText from './DictPanel.shadow.scss?raw'

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

  const panelStyle = useRefFn(() => (
<<<<<<< HEAD:packages/saladict-core/src/views/content/components/DictPanel/DictPanel.portal.tsx
    <style>{import('./DictPanel.shadow.scss').toString()}</style>
=======
    <style>{styleText}</style>
>>>>>>> c908eaa999dbc831b8e70709cf53b61208abd9f2:packages/saladict-core/src/content/components/DictPanel/DictPanel.portal.tsx
  )).current

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
      head={panelStyle}
      shadowRootClassName={SALADICT_PANEL}
      innerRootClassName={classnames({ isAnimate: withAnimation, darkMode })}
      panelCSS={panelCSS}
      in={show}
      timeout={props.withAnimation ? defaultTimeout : 0}
    >
      {() => <DictPanel {...restProps} />}
    </ShadowPortal>
  )
}

export default DictPanelPortal
