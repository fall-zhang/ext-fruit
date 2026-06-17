import { message as antMsg } from 'antd'
import { set } from '@/utils/lodash-polyfill'
import { useTranslation } from 'react-i18next'
import type { AppConfig } from '@/config/app-config'
import { cloneDeep, merge } from 'es-toolkit'
import type { AppProfile } from '@/config/trans-profile'
import { toast } from 'sonner'
import { useConfContext } from '@/context/conf-context/context'
import { updateConfig, updateProfile } from '@/core/file-system/tauri-conf-system'


export const useUpdateSetting = () => {
  const { t } = useTranslation('options')
  // const confContext = useConfContext()
  // const dictStore = useDictStore(state => state.config)
  // const { config, profile } = useConfContext()
  const confContext = useConfContext()
  const config = confContext.config
  // const profile = confContext.profile

  // [stateObjectPaths: string]
  return async (newConfig: Partial<AppConfig>) => {
    // const newConfig: Partial<AppConfig> = {}
    const mergedConf = merge(config, newConfig)
    confContext.updateConfig(mergedConf)

    updateConfig(mergedConf).then(res => {
      toast(t('msg_updated'))
    }).catch(err => {
      console.warn('配置更新失败')
    })
  }
}
