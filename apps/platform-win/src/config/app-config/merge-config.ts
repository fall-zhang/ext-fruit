import { getDefaultConfig, type AppConfig, type AppConfigMutable } from '.'
import { cloneDeep } from 'es-toolkit'

/**
 * 对旧配置文件进行迁移
 * @returns
 */
export function mergeConfig (
  oldConfig: AppConfig,
  baseConfig?: AppConfig
): AppConfig {
  const base: AppConfigMutable = cloneDeep(baseConfig)
    ? JSON.parse(JSON.stringify(baseConfig))
    : getDefaultConfig()
  if (oldConfig.version < 2) {
    base
  }
  return base
}
