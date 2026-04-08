import { Checkbox, Slider, Select } from 'antd'
import type { TFunction } from 'i18next'

import type { SaladictFormItem } from '../SaladictForm'
import { getConfigPath } from '../../-utils/path-joiner'

type Mode = 'mode' | 'panelMode'

export const searchMode = (mode: Mode, t: TFunction): SaladictFormItem => {
  const items: SaladictFormItem[] = []

  items.push(
    {
      name: getConfigPath(mode, 'direct'),
      label: null,
      help: t('searchMode.direct_help'),
      valuePropName: 'checked',
      children: <Checkbox>{t('searchMode.direct')}</Checkbox>,
    },
    {
      name: getConfigPath(mode, 'double'),
      label: null,
      help: t('searchMode.double_help'),
      valuePropName: 'checked',
      children: <Checkbox>{t('searchMode.double')}</Checkbox>,
    },
    {
      key: getConfigPath(mode, 'holding'),
      label: null,
      help: t('searchMode.holding_help'),
      items: [
        {
          name: getConfigPath(mode, 'holding', 'ctrl'),
          label: null,
          className: 'form-item-inline',
          valuePropName: 'checked',
          children: (
            <Checkbox>
              <kbd>Ctrl</kbd>
            </Checkbox>
          ),
        },
        {
          name: getConfigPath(mode, 'holding', 'alt'),
          label: null,
          className: 'form-item-inline',
          valuePropName: 'checked',
          children: (
            <Checkbox>
              <kbd>Alt</kbd>
            </Checkbox>
          ),
        },
        {
          name: getConfigPath(mode, 'holding', 'shift'),
          label: null,
          className: 'form-item-inline',
          valuePropName: 'checked',
          children: (
            <Checkbox>
              <kbd>Shift</kbd>
            </Checkbox>
          ),
        },
        {
          name: getConfigPath(mode, 'holding', 'meta'),
          label: null,
          className: 'form-item-inline',
          valuePropName: 'checked',
          children: (
            <Checkbox>
              <kbd>Meta</kbd>
            </Checkbox>
          ),
        },
      ],
    },
    {
      name: getConfigPath(mode, 'instant', 'enable'),
      label: null,
      help: t('searchMode.instant_help'),
      valuePropName: 'checked',
      children: <Checkbox>{t('searchMode.instant')}</Checkbox>,
    },
    {
      name: getConfigPath(mode, 'instant', 'key'),
      label: t('searchMode.instantKey'),
      help: t('searchMode.instantKey_help'),
      hide: values => !values[getConfigPath(mode, 'instant', 'enable')],
      children: (
        <Select
          style={{ width: 100 }} options={[
            { label: t('searchMode.instantDirect'), value: 'direct' },
            { label: 'Ctrl/⌘', value: 'ctrl' },
            { label: 'Alt', value: 'alt' },
            { label: 'Shift', value: 'shift' },
          ]}>
          {/* <Select.Option value="direct">
            {t('searchMode.instantDirect')}
          </Select.Option>
          <Select.Option value="ctrl">Ctrl/⌘</Select.Option>
          <Select.Option value="alt">Alt</Select.Option>
          <Select.Option value="shift">Shift</Select.Option> */}
        </Select>
      ),
    },
    {
      name: getConfigPath(mode, 'instant', 'delay'),
      label: t('searchMode.instantDelay'),
      hide: values => !values[getConfigPath(mode, 'instant', 'enable')],
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
    }
  )

  return {
    key: getConfigPath(mode),
    items,
  }
}
