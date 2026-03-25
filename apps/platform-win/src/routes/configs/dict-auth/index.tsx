import { createFileRoute } from '@tanstack/react-router'
import { useRef, type FC } from 'react'
import { Input } from 'antd'


import { Trans, useTranslation } from 'react-i18next'
import { useDictStore } from '@/store'
import { SaladictForm, type SaladictFormItem } from '../-components/SaladictForm'
import { getConfigPath, getProfilePath } from '../-utils/path-joiner'
import { useConfContext } from '@/context/conf-context'
import { isKey } from '@/utils/type-utils'

export const RouteComponent: FC = () => {
  const { t } = useTranslation(['options', 'dicts'])
  const dictAuths = useConfContext().profile.dictAuth

  const formRef = useRef(null)
  if (dictAuths === null || dictAuths === undefined) return null

  const formItems: SaladictFormItem[] = [
    {
      key: 'dictauthstitle',
      label: t('nav.DictAuths'),
      children: (
        <span className="ant-form-text">{t('dictAuth.description')}</span>
      ),
    },
  ]

  Object.keys(dictAuths).forEach((dictID) => {
    if (!isKey(dictAuths, dictID)) {
      return
    }
    const auth = dictAuths[dictID]
    const configPath = getProfilePath('dictAuth', dictID)
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
                href={`@/core/api-server/trans-api/${dictID}/auth.ts`}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {title}
              </a>
            </Trans>
          )
          : null,
        style: { marginBottom: isLast ? 10 : 5 },
        children: <Input autoComplete="off" />,
      })
    })
  })

  return <SaladictForm items={formItems} ref={formRef} />
}

export const Route = createFileRoute('/configs/dict-auth/')({
  component: RouteComponent,
})
