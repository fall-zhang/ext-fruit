import { useIsShowDictPanel } from './panel-store'

export const formItemModalLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
} as const

const listLayoutWithPanel = {
  xs: { span: 24 },
  sm: { span: 24 },
  lg: { span: 12 },
} as const

const listLayoutWithoutPanel = {
  xs: { span: 24 },
  sm: { span: 24 },
  lg: { span: 14, offset: 2 },
} as const

export const useListLayout = () =>
  (useIsShowDictPanel() && window.innerWidth < 1920
    ? listLayoutWithPanel
    : listLayoutWithoutPanel)
