import type { FC } from 'react'
import React, { useState } from 'react'
import { Switch, Button, Select } from 'antd'
import { getConfigPath } from '@/options/helpers/path-joiner'
import { SaladictForm } from '@/options/components/SaladictForm'
import { MatchPatternModal } from '../MatchPatternModal'
import { Trans, useTranslation } from 'react-i18next'

// 不再使用该组件，不再对 PDF 进行单独配置
export const PDF: FC = () => {
  const { t } = useTranslation(['options', 'common'])
  const [editingArea, setEditingArea] = useState<
    'pdfBlacklist' | 'pdfWhitelist' | null
  >(null)

  return (
    <>
      <SaladictForm
        items={[
          {
            name: getConfigPath('pdfSniff'),
            valuePropName: 'checked',
            extra: (
              <Trans message={t(getConfigPath('pdfSniff') + '_extra')}>
                <a
                  href="https://saladict.crimx.com/native.html"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  {t('nativeSearch')}
                </a>
              </Trans>
            ),
            children: <Switch />,
          },
          {
            name: getConfigPath('pdfStandalone'),
            children: (
              <Select>
                <Select.Option value="">
                  {t('config.opt.pdfStandalone.default')}
                </Select.Option>
                <Select.Option value="always">
                  {t('config.opt.pdfStandalone.always')}
                </Select.Option>
                <Select.Option value="manual">
                  {t('config.opt.pdfStandalone.manual')}
                </Select.Option>
              </Select>
            ),
          },
          {
            key: 'BlackWhiteList',
            label: t('nav.BlackWhiteList'),
            help: t('config.opt.pdf_blackwhitelist_help'),
            children: (
              <>
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => setEditingArea('pdfBlacklist')}
                >
                  PDF {t('common:blacklist')}
                </Button>
                <Button onClick={() => setEditingArea('pdfWhitelist')}>
                  PDF {t('common:whitelist')}
                </Button>
              </>
            ),
          },
        ]}
      />
      <MatchPatternModal
        area={editingArea}
        onClose={() => setEditingArea(null)}
      />
    </>
  )
}
