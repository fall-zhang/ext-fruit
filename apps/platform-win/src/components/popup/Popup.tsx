import type { FC } from 'react'
import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect
} from 'react'
import classNames from 'clsx'
import QRCode from 'react-qr-code'
import { useTranslation } from 'react-i18next'
import { useConfContext } from '../../context/conf-context'
import { ScanQrCodeIcon } from 'lucide-react'


export const Popup: FC = () => {
  const configContext = useConfContext()
  const { t } = useTranslation('popup')

  const [config, setConfig] = useState(configContext.config)

  /** URL box with QR code */
  const [isShowUrlBox, setIsShowUrlBox] = useState(false)
  const [currentTabUrl, setCurrentTabUrl] = useState('')

  const [dictPanelHeight, setDictPanelHeight] = useState(30)
  const expandDictPanel = useCallback(
    () => setDictPanelHeight(config.baHeight - 51),
    [config.baHeight]
  )
  const shrinkDictPanel = useCallback(
    () => setDictPanelHeight(config.baHeight - 151),
    [config.baHeight]
  )

  /** Instant Capture Mode */
  const [insCapMode, setInsCapMode] = useState<'mode'>('mode')

  const [isTempOff, setTempOff] = useState(false)

  const [isShowPageNoResponse, setShowPageNoResponse] = useState(false)

  useLayoutEffect(() => {
    document.body.style.width = (config.panelWidth) + 'px'
  }, [config])

  useEffect(() => {
    expandDictPanel()

    // addConfigListener(({ newConfig }) => {
    //   setConfig(newConfig)
    // })
  }, [])

  return (
    <div
      className={classNames('popup-root')}
      style={{ height: config.baHeight }}
    >
      {/* <DictPanel /> */}
      <div
        className="switch-container"
        onMouseEnter={shrinkDictPanel}
        onMouseLeave={expandDictPanel}
      >
        <div className="active-switch">
          <span className="switch-title">{t('app_temp_active_title')}</span>
          <input
            type="checkbox"
            id="opt-temp-active"
            className="btn-switch"
            checked={isTempOff}
            onChange={toggleTempOff}
            onFocus={shrinkDictPanel}
          />
          <label htmlFor="opt-temp-active"></label>
        </div>
        <div className="active-switch">
          <span className="switch-title">
            {t('instant_capture_title')}
          </span>
          <input
            type="checkbox"
            id="opt-instant-capture"
            className="btn-switch"
            checked={config[insCapMode].instant.enable}
            onChange={toggleInsCap}
            onFocus={shrinkDictPanel}
          />
          <label htmlFor="opt-instant-capture"></label>
        </div>
        <div className="active-switch">
          <ScanQrCodeIcon/>
          <span className="switch-title">{t('app_active_title')}</span>
          <input
            type="checkbox"
            id="opt-active"
            className="btn-switch"
            checked={config.active}
            onChange={toggleAppActive}
            onFocus={shrinkDictPanel}
          />
          <label htmlFor="opt-active"></label>
        </div>
        <div
          className="qrcode-panel"
          onMouseLeave={() => setCurrentTabUrl('')}
        >
          <QRCode
            value={currentTabUrl}
            size={250}
            // bgColor={config.darkMode ? '#ddd' : '#fff'}
            fgColor="#222"
          />
          <p className="qrcode-panel-title">
            {isShowUrlBox
              ? (
                <input
                  type="text"
                  autoFocus
                  readOnly
                  value={currentTabUrl}
                  onFocus={e => e.currentTarget.select()}
                />
              )
              : (
                <span>{t('qrcode_title')}</span>
              )}
          </p>
          {isShowPageNoResponse && (
            <div className="page-no-response-panel">
              <p className="page-no-response-title">
                {t('page_no_response')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  function toggleTempOff () {
    const newTempOff = !isTempOff

    setTempOff(newTempOff)
  }

  function toggleInsCap () {
    configContext.updateConfig({
      ...config,
      [insCapMode]: {
        ...config[insCapMode],
        instant: {
          ...config[insCapMode].instant,
          enable: !config[insCapMode].instant.enable,
        },
      },
    })
  }

  function toggleAppActive () {
    configContext.updateConfig({
      ...config,
      active: !config.active,
    })
  }

  async function showQRcode () {
    const url = ''
    setIsShowUrlBox(false)
    setCurrentTabUrl(url)
  }
}

export default Popup
