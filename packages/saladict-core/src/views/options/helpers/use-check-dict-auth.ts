import { useContext } from 'react'
import { message } from 'antd'
import { updateConfig } from '@/_helpers/config-manager'
import { useTranslation } from 'react-i18next'
import { ChangeEntryContext } from './change-entry'
import { useDictStore } from '@P/saladict-core/src/store'

export const useCheckDictAuth = () => {
  const { t } = useTranslation('options')
  const changeEntry = useContext(ChangeEntryContext)
  const config = useDictStore(state => state.config)

  return async () => {
    if (!config.showedDictAuth) {
      // opens on Profiles
      await updateConfig({
        ...config,
        showedDictAuth: true,
      })

      if (
        Object.keys(config.dictAuth).every(id =>
          Object.keys(config.dictAuth[id]).every(k => !config.dictAuth[id]?.[k])
        )
      ) {
        message.warning(t('msg_first_time_notice'), 10)
        changeEntry('DictAuths')
        return false
      }
    }

    return true
  }
}
