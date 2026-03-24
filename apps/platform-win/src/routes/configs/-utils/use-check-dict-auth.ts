import { useContext } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { ChangeEntryContext } from './change-entry'
import { useDictStore } from '@/store'
import { useConfContext } from '@/context/conf-context'
import type { DictAuths } from '@/config/trans-profile/auth'
import { isKey } from '@/utils/type-utils'

export const useCheckDictAuth = () => {
  const { t } = useTranslation('options')
  const changeEntry = useContext(ChangeEntryContext)
  // const config = useDictStore(state => state.config)
  const confContext = useConfContext()
  return async () => {
    if (!confContext.config.showedDictAuth) {
      // opens on Profiles
      confContext.updateConfig({
        ...confContext.config,
        showedDictAuth: true,
      })
      const authObj = confContext.profile.dictAuth
      if (
        Object.keys(authObj).every((id) => {
          const key = id as keyof DictAuths
          return Object.keys(authObj[key]).every(k => {
            if (isKey(authObj[key], k)) {
              return !authObj[key]?.[k]
            }
            return true
          })
        })
      ) {
        message.warning(t('msg_first_time_notice'), 10)
        changeEntry('DictAuths')
        return false
      }
    }

    return true
  }
}
