import { useContext } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { ChangeEntryContext } from './change-entry'
import { useDictStore } from '@P/saladict-core/src/store'
import { useConfContext } from '@P/saladict-core/src/context/conf-context'

export const useCheckDictAuth = () => {
  const { t } = useTranslation('options')
  const changeEntry = useContext(ChangeEntryContext)
  const config = useDictStore(state => state.config)
  const confContext = useConfContext()
  return async () => {
    if (!config.showedDictAuth) {
      // opens on Profiles
      confContext.onUpdateConfig({
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
