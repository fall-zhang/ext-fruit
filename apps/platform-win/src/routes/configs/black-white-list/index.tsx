import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { MatchPatternModal } from '../-components/MatchPatternModal'
import { SaladictForm } from '../-components/SaladictForm'

export const Route = createFileRoute('/configs/black-white-list/')({
  component: RouteComponent,
})

function RouteComponent () {
  const { t } = useTranslation(['options', 'common'])
  const [editingArea, setEditingArea] = useState<'whitelist' | 'blacklist' | null>(null)

  return (
    <>
      <SaladictForm
        hideFooter
        items={[
          {
            key: 'BlackWhiteList',
            label: t('config.opt.sel_blackwhitelist'),
            help: t('config.opt.sel_blackwhitelist_help'),
            children: (
              <>
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => setEditingArea('blacklist')}
                >
                  {t('common:blacklist')}
                </Button>
                <Button onClick={() => setEditingArea('whitelist')}>
                  {t('common:whitelist')}
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
