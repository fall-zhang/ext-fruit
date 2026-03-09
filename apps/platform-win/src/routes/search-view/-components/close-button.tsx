import type { FC } from 'react'
import type React from 'react'

/**
 * Close dict panel
 */
export const CloseBtn: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  const { ...restProps } = props
  return (
    <button
      className="menuBar-Btn"
      // title={t('tip.closePanel')}
      {...restProps}>
      <svg
        className="menuBar-Btn_Icon"
        width="30"
        height="30"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 31.112 31.112"
      >
        <path d="M31.112 1.414L29.698 0 15.556 14.142 1.414 0 0 1.414l14.142 14.142L0 29.698l1.414 1.414L15.556 16.97l14.142 14.142 1.414-1.414L16.97 15.556" />
      </svg>
    </button>
  )
}
