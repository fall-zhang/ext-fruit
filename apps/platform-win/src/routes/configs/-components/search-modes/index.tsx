import { Switch, Checkbox, Slider } from 'antd'
import { useTranslation } from 'react-i18next'
import { searchMode } from './search-mode'
import { getConfigPath, getProfilePath } from '../../-utils/path-joiner'
import { SaladictForm } from '../SaladictForm'
import { supportedLangs } from '@/core/api-server/utils/lang-check'

function RouteComponent () {
  const { t } = useTranslation(['options', 'common'])
  return (
    <SaladictForm
      items={[
        {
          name: getConfigPath('noTypeField'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          name: getConfigPath('touchMode'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          key: getConfigPath('language'),
          className: 'saladict-form-danger-extra',
          items: supportedLangs.map(lang => ({
            name: getConfigPath('language', lang),
            className: 'form-item-inline',
            valuePropName: 'checked',
            children: <Checkbox>{t(`common:lang.${lang}`)}</Checkbox>,
          })),
        },
        {
          name: getProfilePath('stickyFold'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          name: getConfigPath('doubleClickDelay'),
          children: (
            <Slider
              min={100}
              max={2000}
              marks={{
                100: '0.1' + t('common:unit.s'),
                2000: '2' + t('common:unit.s'),
              }}
            />
          ),
        },
        searchMode('mode', t),
        searchMode('panelMode', t),
        searchMode('qsPanelMode', t),
      ]}
    />
  )
}
