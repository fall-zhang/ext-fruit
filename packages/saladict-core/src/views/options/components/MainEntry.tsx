import type { FC } from 'react'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { Layout, Row, Col, message as antMsg } from 'antd'
import { ChangeEntryContext } from '../helpers/change-entry'
import { EntrySideBarMemo } from './EntrySideBar'
import { HeaderMemo } from './Header'
import { EntryError } from './EntryError'
import { BtnPreviewMemo } from './BtnPreview'
import { useDictStore } from '@P/saladict-core/src/store'
import { reportPageView } from '@P/saladict-core/src/utils/analytics'
import { ErrorBoundary } from '@P/saladict-core/src/components/ErrorBoundary'
import { I18nContext, useTranslation } from 'react-i18next'
import clsx from 'clsx'

const dataInfo = import.meta.glob('./Entries/*')

const EntryComponent = ({ entry }: { entry: string }) => {
  console.log('⚡️ line:17 ~ entry: ', entry)
  const element = dataInfo[`./Entries/${entry}`]
  if (!element) {
    console.error('no element')
    return React.createElement('div', <div></div>)
  }
  return React.createElement(entry)
}
// React.createElement(dataInfo[`./Entries/${entry}`])

export const MainEntry: FC = () => {
  const { ready } = useTranslation('options')
  const lang = useContext(I18nContext)
  const [entry, setEntry] = useState<string>('General')
  // const warnedMissingPermissionRef = useRef(false)
  // const { analytics, darkMode } = useDictStore(
  //   state => ({
  //     analytics: state.config.analytics,
  //     darkMode: state.config.darkMode,
  //   })
  // )

  // useEffect(() => {
  //   if (entry) {
  //     const { protocol, host, pathname } = window.location
  //     const newurl = `${protocol}//${host}${pathname}?menuselected=${entry}`
  //     window.history.pushState({ key: entry }, '', newurl)
  //   }
  //   if (analytics) {
  //     reportPageView(`/options/${entry}`)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (ready && !warnedMissingPermissionRef.current) {
  //     warnedMissingPermissionRef.current = true
  //     const permission = new URL(document.URL).searchParams.get(
  //       'missing_permission'
  //     )
  //     if (permission) {
  //       antMsg.warning(
  //         t('permissions.missing', {
  //           permission: t(`permissions.${permission}`),
  //         }),
  //         20
  //       )
  //     }
  //   }
  // }, [])

  return (
    <>
      <HeaderMemo />
      <div className={clsx('flex w-full justify-center', 'main-entry dark-mode')} >
        <div className="w-40">
          <EntrySideBarMemo entry={entry} onChange={setEntry} />
        </div>
        <div className="flex w-7xl p-6">
          <ChangeEntryContext.Provider value={setEntry}>
            <ErrorBoundary key={entry + lang} error={EntryError}>
              {ready && <EntryComponent entry={entry} />}
            </ErrorBoundary>
          </ChangeEntryContext.Provider>
          <BtnPreviewMemo />
        </div>
      </div>
    </>
  )
}
