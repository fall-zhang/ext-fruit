import { notification, message as antMsg } from 'antd'
import set from 'lodash/set'
import { useTranslation } from 'react-i18next'
import { setFormDirty } from './use-form-dirty'
import type { AppConfig } from '@/config/app-config'
import { useDictStore } from '@/store'
import { cloneDeep } from 'es-toolkit'
import type { AppProfile } from '@/config/trans-profile'
import { toast } from 'sonner'
import { useConfContext } from '@/context/conf-context'
import { updateConfig, updateProfile } from '@/core/file-system/tauri-conf-system'


export const useUpdateSetting = () => {
  const { t } = useTranslation('options')
  // const confContext = useConfContext()
  // const dictStore = useDictStore(state => state.config)
  // const { config, profile } = useConfContext()
  const confContext = useConfContext()
  const config = confContext.config
  const profile = confContext.profile

  // [stateObjectPaths: string]
  return async (values: Record<string, any>) => {
    const data: { config?: AppConfig; profile?: AppProfile } = {}
    const paths = Object.keys(values)
    if (import.meta.env.VITE_DEBUG) {
      if (paths.length <= 0) {
        console.warn('Saving empty fields.', values)
      }
    }

    for (const path of paths) {
      if (path.startsWith('config.')) {
        if (!data.config) {
          data.config = cloneDeep(config)
        }
        set(data, path, values[path])
      } else if (path.startsWith('profile.')) {
        if (!data.profile) {
          data.profile = cloneDeep(profile)
        }
        set(data, path, values[path])
      } else {
        console.error(new Error(`Saving unknown path: ${path}`))
      }
    }

    const requests = []

    if (data.config) {
      requests.push(updateConfig(data.config))
      confContext.updateConfig(data.config)
    }

    if (data.profile) {
      requests.push(updateProfile(data.profile))
      confContext.updateProfile(data.profile)
    }

    try {
      await Promise.all(requests)
      setFormDirty(false)

      antMsg.destroy()
      antMsg.success(t('msg_updated'))
    } catch (e: any) {
      toast.warning(t('config.opt.upload_error'), {
        description: e.message,
      })
      console.error(e)
    }

    if (import.meta.env.VITE_DEBUG) {
      console.log('saved setting', data)
    }
  }
}
