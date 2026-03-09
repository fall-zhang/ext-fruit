import './src/locales/i18n'
import { OptProvider } from './src/context/opt-context'
import { ConfProvider } from './src/context/conf-context'
import type { ConfigType } from './src/app-config/config-type'
import { SaladPanel } from './src/views/salad-panel/salad-panel'
export {
  SaladPanel,
  OptProvider,
  ConfProvider
}

export type { Word } from './src/types/word'

type SaladictConfig = ConfigType
export type {
  SaladictConfig
}
