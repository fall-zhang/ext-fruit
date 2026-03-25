import { createFileRoute } from '@tanstack/react-router'
import { useRef, type FC } from 'react'
import { Switch, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { getConfigPath, getProfilePath } from '../-utils/path-joiner'
import { SaladictForm } from '../-components/SaladictForm'
import { useDictStore } from '@/store'
import { useConfContext } from '@/context/conf-context'

export const Route = createFileRoute('/configs/pronunciation/')({
  component: RouteComponent,
})

function RouteComponent () {
  // pronounce
  const { t } = useTranslation(['options', 'common', 'dicts'])
  const confContext = useConfContext()
  const cnConf = confContext.profile.dicts.all.zdic.options.audio ? confContext.config.autoPronounce.cn.list : confContext.config.autoPronounce.cn.list.filter(id => id !== 'zdic')
  const enConf = confContext.config.autoPronounce.en.list
  // const autoPlayLists = useDictStore(state => ({
  //   cn: state.activeProfile.dicts.all.zdic.options.audio
  //     ? state.config.autoPronounce.cn.list
  //     : state.config.autoPronounce.cn.list.filter(id => id !== 'zdic'),
  //   en: state.config.autoPronounce.en.list,
  //   machine: state.config.autoPronounce.machine.list,
  // }))
  const ref = useRef(null)
  return (
    <SaladictForm
      ref={ref}
      items={[
        {
          name: getConfigPath('autoPronounce', 'cn', 'dict'),
          children: (
            <Select
              options={[
                { label: t('common:none'), value: '' },
                ...cnConf.map(id => ({
                  label: t(`dicts:${id}.name`),
                  value: id,
                })),
              ]}
            />
          ),
        },
        {
          name: getConfigPath('autoPronounce', 'en', 'dict'),
          children: (
            <Select
              options={[
                { label: t('common:none'), value: '' },
                ...enConf.map(id => ({
                  label: t(`dicts:${id}.name`),
                  value: id,
                })),
              ]}
            />
          ),
        },
        {
          name: getConfigPath('autoPronounce', 'en', 'accent'),
          hide: values => !values[getConfigPath('autoPronounce', 'en', 'dict')],
          children: (
            <Select
              options={[
                { label: t('config.opt.accent.uk'), value: 'uk' },
                { label: t('config.opt.accent.us'), value: 'us' },
              ]}
            />
          ),
        },
        // {
        //   name: getConfigPath('autoPronounce', 'machine', 'dict'),
        //   children: (
        //     <Select
        //       options={[
        //         { label: t('common:none'), value: '' },
        //         ...autoPlayLists.machine.map(id => ({
        //           label: t(`dicts:${id}.name`),
        //           value: id,
        //         })),
        //       ]}
        //     />
        //   ),
        // },
        {
          name: getConfigPath('autoPronounce', 'machine', 'src'),
          hide: values => !values[getConfigPath('autoPronounce', 'machine', 'dict')],
          children: (
            <Select
              options={[
                { label: t('config.autoPronounce.machine.src_trans'), value: 'trans' },
                { label: t('config.autoPronounce.machine.src_search'), value: 'searchText' },
              ]}
            />
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
