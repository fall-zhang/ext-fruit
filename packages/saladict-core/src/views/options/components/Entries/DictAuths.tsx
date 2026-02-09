import React, { FC } from 'react'
import { Input } from 'antd'
import { useSelector } from '@/content/redux'
import { getConfigPath } from '@/options/helpers/path-joiner'
import {
  SaladictForm,
  SaladictFormItem
} from '@/options/components/SaladictForm'
import { useTranslate, Trans } from '@/_helpers/i18n'

export const DictAuths: FC = () => {
  const { t } = useTranslation(['options', 'dicts'])
  const dictAuths = useSelector(state => state.config.dictAuth)

  if (dictAuths === null || dictAuths === undefined) return null

  const formItems: SaladictFormItem[] = [
    {
      key: 'dictauthstitle',
      label: t('nav.DictAuths'),
      children: (
        <span className="ant-form-text">{t('dictAuth.description')}</span>
      )
    }
  ]

  Object.keys(dictAuths).forEach(dictID => {
    const auth = dictAuths[dictID]!
    const configPath = getConfigPath('dictAuth', dictID)
    const title = t(`dicts:${dictID}.name`)

    Object.keys(auth).forEach((key, i, keys) => {
      const isLast = i + 1 === keys.length
      formItems.push({
        name: configPath + '.' + key,
        label: (
          <span>
            {i === 0 ? title + ' ' : ''}
            <code>{key}</code>
          </span>
        ),
        help: isLast
          ? (
            <Trans message={t('dictAuth.dictHelp')}>
              <a
                href={`@/components/Dictionaries/${dictID}/auth.ts`}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {title}
              </a>
            </Trans>
          )
          : null,
        style: { marginBottom: isLast ? 10 : 5 },
        children: <Input autoComplete="off" />
      })
    })
  })

  return <SaladictForm items={formItems} />
}
