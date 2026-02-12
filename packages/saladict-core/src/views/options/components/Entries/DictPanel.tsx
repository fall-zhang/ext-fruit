import type { FC } from 'react'
import { Select, Switch, Input, Slider } from 'antd'
import { useTranslation } from 'react-i18next'

import { getConfigPath, getProfilePath } from '../../helpers/path-joiner'
import { SaladictForm } from '../SaladictForm'

export const DictPanel: FC = () => {
  const { t } = useTranslation('options')
  const { availWidth } = window.screen
  return (
    <SaladictForm
      items={[
        {
          name: getProfilePath('mtaAutoUnfold'),
          children: (
            <Select>
              <Select.Option value="">
                {t('profile.opt.mtaAutoUnfold.never')}
              </Select.Option>
              <Select.Option value="once">
                {t('profile.opt.mtaAutoUnfold.once')}
              </Select.Option>
              <Select.Option value="always">
                {t('profile.opt.mtaAutoUnfold.always')}
              </Select.Option>
              <Select.Option value="popup">
                {t('profile.opt.mtaAutoUnfold.popup')}
              </Select.Option>
              <Select.Option value="hide">
                {t('profile.opt.mtaAutoUnfold.hide')}
              </Select.Option>
            </Select>
          ),
        },
        {
          name: getProfilePath('waveform'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          name: getConfigPath('searchSuggests'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          name: getConfigPath('defaultPinned'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          name: getConfigPath('animation'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          name: getConfigPath('darkMode'),
          valuePropName: 'checked',
          children: <Switch />,
        },
        {
          name: getConfigPath('panelMaxHeightRatio'),
          children: (
            <Slider
              min={0}
              max={100}
              marks={{ 0: '0%', 80: '80%', 100: '100%' }}
            />
          ),
        },
        {
          name: getConfigPath('panelWidth'),
          children: (
            <Slider
              min={250}
              max={availWidth}
              marks={{
                250: '250px',
                450: '450px',
                [availWidth]: `${availWidth}px`,
              }}
            />
          ),
        },
        {
          name: getConfigPath('fontSize'),
          children: (
            <Slider
              min={8}
              max={30}
              marks={{ 8: '8px', 30: '30px' }}
            />
          ),
        },
        {
          name: getConfigPath('bowlOffsetX'),
          children: (
            <Slider
              min={-100}
              max={100}
              marks={{ '-100': '-100px', 0: '0px', 100: '100px' }}
            />
          ),
        },
        {
          name: getConfigPath('bowlOffsetY'),
          children: (
            <Slider
              min={-100}
              max={100}
              marks={{ '-100': '-100px', 0: '0px', 100: '100px' }}
            />
          ),
        },
        {
          name: getConfigPath('panelCSS'),
          extra: (
            <a
              href="https://github.com/crimx/ext-saladict/wiki/PanelCSS#wiki-content"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Examples
            </a>
          ),
          children: (
            <Input.TextArea
              placeholder=".dictPanel-Root { }"
              autoSize={{ minRows: 4, maxRows: 15 }}
            />
          ),
        },
      ]}
    />
  )
}
