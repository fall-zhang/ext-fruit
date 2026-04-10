import { createFileRoute } from '@tanstack/react-router'

import type { TFunction } from 'i18next'
import { Row, Col, Upload, notification } from 'antd'
import type { RcFile } from 'antd/lib/upload'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { AppConfig } from '@/config/app-config'
import { mergeConfig } from '@/config/app-config/merge-config'
import { useListLayout } from '../-utils/layout'
import { useConfContext } from '@/context/conf-context'
import type { Profile } from '@/config/trans-profile'
import { mergeProfile } from '@/config/trans-profile/merge-profile'
import type { ProfileID } from '@/core/api-local/profile'
import { updateConfig } from '@/core/file-system/tauri-conf-system'

export const Route = createFileRoute('/configs/import-export/')({
  component: RouteComponent,
})

export type ConfigStorage = {
  baseconfig: AppConfig
  activeProfileID: string
  hasInstructionsShown: boolean
  profileIDList: ProfileID[]
} & {
  [id: string]: Profile
}

function RouteComponent () {
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

    const {
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

    // if (syncConfig) {
    //   localStorage.setItem('syncConfig', syncConfig)
    // }

    if (hasInstructionsShown != null) {
      localStorage.setItem('hasInstructionsShown', JSON.stringify(hasInstructionsShown))
    }

    // if (profileIDList) {
    //   profileIDList = profileIDList.filter(({ id }) => result[id])
    //   if (profileIDList.length > 0) {
    //     for (const { id } of profileIDList) {
    //       await updateProfile(mergeProfile(result[id] as Profile))
    //     }
    //     if (
    //       !activeProfileID ||
    //     profileIDList.every(({ id }) => id !== activeProfileID)
    //     ) {
    //     // use first item instead
    //       activeProfileID = profileIDList[0].id
    //     }
    //     await localStorage.setItem('activeProfileID', JSON.stringify(activeProfileID))
    //     await localStorage.setItem('profileIDList', profileIDList)
    //   }
    // }
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
      const text = JSON.stringify(result)
      // const { os } = await browser.runtime.getPlatformInfo()

      // if (os === 'win') {
      //   text = text.replace(/\r\n|\n/g, '\r\n')
      // }
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
    <>
      <div className='grid gap-5 grid-cols-2'>
        <div>
          <button >
            <p className="ant-upload-drag-icon">
              <DownloadOutlined />
            </p>
            <p className="ant-upload-text">{t('import.title')}</p>
          </button>
        </div>
        <div>
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
        </div>
      </div>
      <p className='p-4 text-sm'>{t('import_export_help')}</p>
    </>
  )
}
