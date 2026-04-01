import type { FC } from 'react'
import type React from 'react'
import { InputNumber } from 'antd'
import type { InputNumberProps } from 'antd/lib/input-number'

import './_style.scss'

export interface InputNumberGroupProps extends InputNumberProps {
  suffix?: React.ReactNode
}

export const InputNumberGroup: FC<InputNumberGroupProps> = props => {
  const { suffix, ...restProps } = props
  return (
    <span className="input-number-group-wrapper">
      <span className="input-number-group">
        <InputNumber {...restProps} />
        {suffix && <span className="input-number-group-addon">{suffix}</span>}
      </span>
    </span>
  )
}
