import type { FC } from 'react'
import { useState } from 'react'
import { Select, Slider, Switch, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { searchMode } from '../SearchModes/searchMode'
import { TitlebarOffsetModal } from './TitlebarOffsetModal'
import { getConfigPath } from '../../../helpers/path-joiner'
import { SaladictModalForm } from '../../SaladictModalForm'

export interface StandaloneModalProps {
  show: boolean
  onClose: () => void
}

export const StandaloneModal: FC<StandaloneModalProps> = ({
  show,
  onClose,
}) => {
  const { t } = useTranslation(['options', 'common'])
  const { availHeight } = window.screen
  const [showTitlebarOffsetModal, setTitlebarOffsetModal] = useState(false)

  return (
    <>
      <SaladictModalForm
        title={t(getConfigPath('qsStandalone'))}
        visible={show}
        onClose={onClose}
        items={[
          {
            name: getConfigPath('qssaSidebar'),
            children: (
              <Select>
                <Select.Option value="">{t('common:none')}</Select.Option>
                <Select.Option value="left">
                  {t('locations.LEFT')}
                </Select.Option>
                <Select.Option value="right">
                  {t('locations.RIGHT')}
                </Select.Option>
              </Select>
            ),
          },
     
          {
            name: getConfigPath('qssaRectMemo'),
            valuePropName: 'checked',
            children: <Switch />,
          },
          {
            key: 'titlebar-offset',
            label: t('titlebarOffset.title'),
            help: t('titlebarOffset.help'),
            children: (
              <Button onClick={() => setTitlebarOffsetModal(true)}>
                {t('titlebarOffset.title')}
              </Button>
            ),
          },
          {
            name: getConfigPath('qssaPageSel'),
            valuePropName: 'checked',
            children: <Switch />,
          },
          {
            ...searchMode('qsPanelMode', t),
            label: t('page_selection'),
          },
        ]}
      />
      <TitlebarOffsetModal
        show={showTitlebarOffsetModal}
        onClose={() => setTitlebarOffsetModal(false)}
      />
    </>
  )
}
