import React, { FC, useState } from 'react'
import { Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'

export interface PatternItemProps {
  value?: [string, string]
  onChange?: (value: [string, string]) => void
}

export const PatternItem: FC<PatternItemProps> = ({ value, onChange }) => {
  const { t } = useTranslation('options')
  const [patternType, setPatternType] = useState<'0' | '1'>(
    value?.[1] ? '1' : '0'
  )

  return (
    <Input
      addonBefore={
        <Select
          value={patternType}
          onChange={setPatternType}
          className="select-before"
        >
          <Select.Option value="0">{t('matchPattern.regex')}</Select.Option>
          <Select.Option value="1">{t('matchPattern.url')}</Select.Option>
        </Select>
      }
      value={value?.[patternType]}
      onChange={e => {
        if (patternType === '0') {
          // regex
          onChange && onChange([e.currentTarget.value, ''])
        } else {
          // url
          onChange && onChange(['', e.currentTarget.value])
        }
      }}
    />
  )
}
