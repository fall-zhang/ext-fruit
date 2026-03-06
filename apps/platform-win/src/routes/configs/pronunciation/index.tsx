import { createFileRoute } from '@tanstack/react-router'
import type { FC } from 'react'
import { Switch, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { getConfigPath, getProfilePath } from '../-utils/path-joiner'
import { SaladictForm } from '../-components/SaladictForm'
import { useDictStore } from '@P/saladict-core/src/store'

export const Route = createFileRoute('/configs/pronunciation/')({
  component: RouteComponent,
})

function RouteComponent () {
  const { t } = useTranslation(['options', 'common', 'dicts'])
  const autopronLists = useDictStore(state => ({
    cn: state.activeProfile.dicts.all.zdic.options.audio
      ? state.config.autoPronounce.cn.list
      : state.config.autoPronounce.cn.list.filter(id => id !== 'zdic'),
    en: state.config.autoPronounce.en.list,
    machine: state.config.autoPronounce.machine.list,
  }))

  return (
    <SaladictForm
      items={[
        {
          name: getConfigPath('autoPronounce', 'cn', 'dict'),
          children: (
            <Select>
              <Select.Option value="">{t('common:none')}</Select.Option>
              {autopronLists.cn.map(id => (
                <Select.Option key={id} value={id}>
                  {t(`dicts:${id}.name`)}
                </Select.Option>
              ))}
            </Select>
          ),
        },
        {
          name: getConfigPath('autoPronounce', 'en', 'dict'),
          children: (
            <Select>
              <Select.Option value="">{t('common:none')}</Select.Option>
              {autopronLists.en.map(id => (
                <Select.Option key={id} value={id}>
                  {t(`dicts:${id}.name`)}
                </Select.Option>
              ))}
            </Select>
          ),
        },
        {
          name: getConfigPath('autoPronounce', 'en', 'accent'),
          hide: values => !values[getConfigPath('autoPronounce', 'en', 'dict')],
          children: (
            <Select>
              <Select.Option value="uk">
                {t('config.opt.accent.uk')}
              </Select.Option>
              <Select.Option value="us">
                {t('config.opt.accent.us')}
              </Select.Option>
            </Select>
          ),
        },
        {
          name: getConfigPath('autoPronounce', 'machine', 'dict'),
          children: (
            <Select>
              <Select.Option value="">{t('common:none')}</Select.Option>
              {autopronLists.machine.map(id => (
                <Select.Option key={id} value={id}>
                  {t(`dicts:${id}.name`)}
                </Select.Option>
              ))}
            </Select>
          ),
        },
        {
          name: getConfigPath('autoPronounce', 'machine', 'src'),
          hide: values => !values[getConfigPath('autoPronounce', 'machine', 'dict')],
          children: (
            <Select>
              <Select.Option value="trans">
                {t('config.autoPronounce.machine.src_trans')}
              </Select.Option>
              <Select.Option value="searchText">
                {t('config.autoPronounce.machine.src_search')}
              </Select.Option>
            </Select>
          ),
        },
        {
          name: getProfilePath('waveform'),
          valuePropName: 'checked',
          children: <Switch />,
        },
      ]}
    />
  )
}
