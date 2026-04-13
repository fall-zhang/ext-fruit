import type { AppConfig } from '@/config/app-config'
import type { ReactNode } from 'react'
import type { ControllerProps } from 'react-hook-form'

export interface SaladictFormItem
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'name' | 'children'> {
  /** Must set name or key. Set name if the item has value. */
  name: keyof AppConfig
  fromType: 'switch' | 'input' | 'textarea' | 'slide' | 'select' | 'custom'
  customRender?: ControllerProps['render']
  options?: Array<{ label: string, value: string }>
  /** label 名称. */
  label?: ReactNode
  /** Must set name or key. Set key if the item does not carry value. 当没有值的时候，必须设置 key */
  key?: string
  /** Nested items. Must set items or children. */
  // items?: SaladictFormItem[]
  /** Must set items or children. */
  // children?: ReactNode
  /** Help text */
  help?: ReactNode
  /** Extra text */
  extra?: ReactNode
}
