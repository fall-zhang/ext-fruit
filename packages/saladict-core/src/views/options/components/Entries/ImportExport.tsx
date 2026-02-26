/* eslint-disable no-await-in-loop */
import type { FC } from 'react'
import type { TFunction } from 'i18next'
import { Row, Col, Upload, notification } from 'antd'
import type { RcFile } from 'antd/lib/upload'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { AppConfig } from '@P/saladict-core/src/app-config'
import { mergeConfig } from '@P/saladict-core/src/app-config/merge-config'
import { useListLayout } from '../../helpers/layout'
import { mergeProfile } from '@P/saladict-core/src/app-config/merge-profile'
import type { Profile, ProfileID } from '@P/saladict-core/src/app-config/profiles'
import { useConfContext } from '@P/saladict-core/src/context/conf-context'

export type ConfigStorage = {
  baseconfig: AppConfig
  activeProfileID: string
  hasInstructionsShown: boolean
  profileIDList: ProfileID[]
} & {
  [id: string]: Profile
}

export const ImportExport: FC = () => {
  const { t } = useTranslation('options')
  const layout = useListLayout()
  async function importConfig (file: RcFile, t: TFunction) {
    const result = await new Promise<Partial<ConfigStorage> | null>(resolve => {
      const fr = new FileReader()
      fr.onload = () => {
        try {
          const json = JSON.parse(fr.result as string)
          resolve(json)
        } catch (err) {
          notification.error({
            message: t('import.error.title'),
            description: t('import.error.parse'),
          })
        }
        resolve(null)
      }
      fr.onerror = () => {
        notification.error({
          message: t('import.error.title'),
          description: t('import.error.parse'),
        })
        resolve(null)
      }
      fr.readAsText(file)
    })

    if (!result) {
      return
    }

    let {
      baseconfig,
      activeProfileID,
      hasInstructionsShown,
      profileIDList,
      syncConfig,
    } = result

    if (
      !baseconfig &&
    !activeProfileID &&
    !profileIDList &&
    hasInstructionsShown == null
    ) {
      notification.error({
        message: t('import.error.title'),
        description: t('import.error.empty'),
      })
      return
    }

    localStorage.clear()

    if (baseconfig) {
      await updateConfig(mergeConfig(baseconfig))
    }

    if (syncConfig) {
      localStorage.setItem('syncConfig', syncConfig)
    }

    if (hasInstructionsShown != null) {
      localStorage.setItem('hasInstructionsShown', JSON.stringify(hasInstructionsShown))
    }

    if (profileIDList) {
      profileIDList = profileIDList.filter(({ id }) => result[id])
      if (profileIDList.length > 0) {
        for (const { id } of profileIDList) {
          await updateProfile(mergeProfile(result[id] as Profile))
        }
        if (
          !activeProfileID ||
        profileIDList.every(({ id }) => id !== activeProfileID)
        ) {
        // use first item instead
          activeProfileID = profileIDList[0].id
        }
        await localStorage.setItem('activeProfileID', JSON.stringify(activeProfileID))
        await localStorage.setItem('profileIDList', profileIDList)
      }
    }
  }
  const confContext = useConfContext()
  const updateProfile = confContext.updateProfile
  const getConfig = () => confContext.config
  const getProfile = () => confContext.profile
  async function exportConfig (t: TFunction) {
    const result = await localStorage.get([
      'activeProfileID',
      'hasInstructionsShown',
      'profileIDList',
      'syncConfig',
    ])

    result.baseconfig = getConfig()

    if (!result.baseconfig || !result.activeProfileID || !result.profileIDList) {
      notification.error({
        message: t('export.error.title'),
        description: t('export.error.empty'),
      })
      return
    }

    for (const { id } of result.profileIDList) {
      result[id] = getProfile()
    }

    try {
      let text = JSON.stringify(result)
      const { os } = await browser.runtime.getPlatformInfo()
      if (os === 'win') {
        text = text.replace(/\r\n|\n/g, '\r\n')
      }
      const file = new Blob([text], { type: 'text/plain;charset=utf-8' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(file)
      a.download = `config-${Date.now()}.saladict`

      // firefox
      a.target = '_blank'
      document.body.appendChild(a)

      a.click()
    } catch (err) {
      notification.error({
        message: t('export.error.title'),
        description: t('export.error.parse'),
      })
    }
  }

  return (
    <Row>
      <Col {...layout}>
        <Row gutter={10}>
          <Col span={12}>
            <Upload.Dragger
              showUploadList={false}
              beforeUpload={file => {
                importConfig(file, t)
                return false
              }}
            >
              <p className="ant-upload-drag-icon">
                <DownloadOutlined />
              </p>
              <p className="ant-upload-text">{t('import.title')}</p>
            </Upload.Dragger>
          </Col>
          <Col span={12}>
            <button
              className="ant-upload ant-upload-drag"
              onClick={() => exportConfig(t)}
            >
              <div className="ant-upload ant-upload-btn">
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">{t('export.title')}</p>
              </div>
            </button>
          </Col>
        </Row>
        <Row justify="center">
          <p style={{ margin: '1em 0' }}>{t('import_export_help')}</p>
        </Row>
      </Col>
    </Row>
  )
}


