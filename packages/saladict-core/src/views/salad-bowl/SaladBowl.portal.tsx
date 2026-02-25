import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import type { SaladBowlProps } from './SaladBowl'
import { SaladBowl } from './SaladBowl'
import saladBolStyle from './SaladBowl.shadow.scss?raw'
import ShadowPortal from '../../components/ShadowPortal'
const animationTimeout = { enter: 1000, exit: 100, appear: 1000 }

export interface SaladBowlPortalProps extends Omit<SaladBowlProps, 'onHover'> {
  show: boolean
  panelCSS: string
  withAnimation: boolean
}

/**
 * React portal wrapped SaladBowlShadow.
 * Detach from DOM when not visible.
 */
export const SaladBowlPortal: FC<SaladBowlPortalProps> = props => {
  const { show, panelCSS, withAnimation, ...restProps } = props
  const [isHover, setHover] = useState(false)

  return (
    <ShadowPortal
      id="saladict-saladbowl-root"
      head={<style>{saladBolStyle}</style>}
      classNames="saladbowl"
      innerRootClassName={withAnimation ? 'isAnimate' : ''}
      panelCSS={panelCSS}
      in={show || isHover}
      timeout={withAnimation ? animationTimeout : 0}
    >
      {() => <SaladBowl {...restProps} onHover={setHover} />}
    </ShadowPortal>
  )
}
