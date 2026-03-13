import { notification, message as antMsg } from 'antd'
import set from 'lodash/set'
import { useTranslation } from 'react-i18next'
import { setFormDirty } from './use-form-dirty'
import type { AppConfig } from '@/config/app-config'
import type { Profile } from '@/config/app-config/profiles'
import { useDictStore } from '@/store'
import { cloneDeep } from 'es-toolkit'


export const useUpload = () => {
  const { t } = useTranslation('options')
  // const confContext = useConfContext()
  const dictStore = useDictStore(state => state.config)
  // [stateObjectPaths: string]
  return async (values: Record<string, any>) => {
    const data: { config?: AppConfig; profile?: Profile } = {}
    const paths = Object.keys(values)

    if (import.meta.env.VITE_DEBUG) {
      if (paths.length <= 0) {
        console.warn('Saving empty fields.', values)
      }
    }

    for (const path of paths) {
      if (path.startsWith('config.')) {
        if (!data.config) {
          data.config = cloneDeep(dictStore)
        }
        set(data, path, values[path])
      } else if (path.startsWith('profile.')) {
        if (!data.profile) {
          data.profile = cloneDeep(dictStore.activeProfile)
        }
        set(data, path, values[path])
      } else {
        console.error(new Error(`Saving unknown path: ${path}`))
      }
    }

    const requests: Promise<void>[] = []

    // if (data.config) {
    //   requests.push(updateConfig(data.config))
    // }

    // if (data.profile) {
    //   requests.push(updateProfile(data.profile))
    // }

    try {
      await Promise.all(requests)
      setFormDirty(false)

      antMsg.destroy()
      antMsg.success(t('msg_updated'))
    } catch (e) {
      notification.error({
        message: t('config.opt.upload_error'),
        description: e.message,
      })
      console.error(e)
    }

    if (import.meta.env.VITE_DEBUG) {
      console.log('saved setting', data)
    }
  }
}
