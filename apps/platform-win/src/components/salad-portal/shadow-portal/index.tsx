import { SALADICT_EXTERNAL } from '@/config/const/saladict'
import type { ReactNode } from 'react'
import type React from 'react'
import { useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import root from 'react-shadow'

export const defaultTimeout = { enter: 400, exit: 100, appear: 400 }

const defaultClassNames = 'shadowPortal'

// prevent styles in shadow dom from inheriting outside rules
const styleResetBoundary: React.CSSProperties = { all: 'initial' }

export interface ShadowPortalOwnProps {
  /** Unique id for the injected element */
  id: string
  /** Static content before the children  */
  head?: ReactNode
  shadowRootClassName?: string
  innerRootClassName?: string
  panelCSS?: string
  children: ReactNode
}

export type ShadowPortalProps = ShadowPortalOwnProps
/**
 * Render a shadow DOM on Portal to a removable element with transition.
 * Insert the element to DOM when the Component mounts.
 * Remove the element from DOM when the Component unmounts.
 */
export const ShadowPortal = (props: ShadowPortalProps) => {
  const {
    id,
    head,
    shadowRootClassName,
    innerRootClassName,
    panelCSS,
  } = props

  const $root = useMemo(() => {
    let $root = document.getElementById(id)
    if (!$root) {
      $root = document.createElement('div')
      $root.id = id
      $root.className = `saladict-div ${shadowRootClassName ||
        SALADICT_EXTERNAL}`
    }
    return $root
  }, [id, shadowRootClassName])

  // unmout element when React node unmounts
  useEffect(() => {
    return () => {
      if ($root.parentNode) {
        $root.remove()
      }
    }
  }, [])

  return createPortal(
    <root.div className={shadowRootClassName || SALADICT_EXTERNAL}>
      <div className={innerRootClassName} style={styleResetBoundary}>
        {head}
        {panelCSS ? <style>{panelCSS}</style> : null}
        {/* <CSSTransition
          classNames={defaultClassNames}
          mountOnEnter
          unmountOnExit
          appear
          timeout={defaultTimeout}
          {...restProps}
          onEnter={(...args) => {
            if (!$root.parentNode) {
              document.documentElement.appendChild($root)
            }
            if (onEnter) {
              return onEnter(...args)
            }
          }}
          onExited={(...args) => {
            if ($root.parentNode) {
              $root.remove()
            }
            if (onExited) {
              return onExited(...args)
            }
          }}
        /> */}
        {props.children}
      </div>
    </root.div>,
    $root
  )
}

export default ShadowPortal
