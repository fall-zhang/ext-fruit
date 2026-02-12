import type { FC, ReactNode } from 'react'
import React, { useState } from 'react'
import { Layout, Menu, Affix, Modal } from 'antd'
import {
  SettingOutlined,
  TagsOutlined,
  DashboardOutlined,
  ProfileOutlined,
  SelectOutlined,
  BookOutlined,
  SoundOutlined,
  FilePdfOutlined,
  DatabaseOutlined,
  LayoutOutlined,
  FlagOutlined,
  ExceptionOutlined,
  SwapOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  KeyOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import './_style.scss'
import clsx from 'clsx'
import { setFormDirty, useFormDirty } from '../../helpers/use-form-dirty'
import { Sidebar, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@P/ui/components/ui/sidebar'

export interface EntrySideBarProps {
  entry: string
  onChange: (entry: string) => void
}

const MenuItemWrap:FC<{
  onChangeMenu():void
  children:ReactNode
}> = ({ onChangeMenu, children }) => {
  return <SidebarMenuItem>
    <SidebarMenuButton asChild onClick={onChangeMenu}>
      <span className='cursor-pointer'>
        {children}
      </span>
    </SidebarMenuButton>
  </SidebarMenuItem>
}

export const EntrySideBar: FC<EntrySideBarProps> = props => {
  const { t } = useTranslation('options')
  const formDirtyRef = useFormDirty()
  // trigger affix rerendering on collapse state changes to update width
  function onChangeMenu (menu:string) {
    const switchTab = () => {
      props.onChange(menu)
      setFormDirty(false)
    }
    if (formDirtyRef.value) {
      Modal.confirm({
        title: t('unsave_confirm'),
        icon: <ExclamationCircleOutlined />,
        okType: 'danger',
        onOk: switchTab,
      })
    } else {
      switchTab()
    }
  }
  return (
    <div className={clsx('w-45 entry-sidebar', 'fancy-scrollbar')} >
      <SidebarProvider>

        <SidebarMenu>
          <MenuItemWrap onChangeMenu={() => onChangeMenu('General')}>
            <SettingOutlined />
            <span>{t('nav.General')}</span>
          </MenuItemWrap>
          <MenuItemWrap onChangeMenu={() => onChangeMenu('Notebook')}>
            <TagsOutlined />
            <span>{t('nav.Notebook')}</span>
          </MenuItemWrap>
          <MenuItemWrap onChangeMenu={() => onChangeMenu('Profiles')}>
            <DashboardOutlined />
            <span>{t('nav.Profiles')}</span>
          </MenuItemWrap>
          <MenuItemWrap onChangeMenu={() => onChangeMenu('DictPanel')}>
            <ProfileOutlined />
            <span>{t('nav.DictPanel')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('SearchModes')}>
            <SelectOutlined />
            <span>{t('nav.SearchModes')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('Dictionaries')}>
            <BookOutlined />
            <span>{t('nav.Dictionaries')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('DictAuths')}>
            <KeyOutlined />
            <span>{t('nav.DictAuths')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('Popup')}>
            <LayoutOutlined />
            <span>{t('nav.Popup')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('QuickSearch')}>
            <FlagOutlined />
            <span>{t('nav.QuickSearch')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('Pronunciation')}>
            <SoundOutlined />
            <span>{t('nav.Pronunciation')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('PDF')}>
            <FilePdfOutlined />
            <span>{t('nav.PDF')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('ContextMenus')}>
            <DatabaseOutlined />
            <span>{t('nav.ContextMenus')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('BlackWhiteList')}>
            <ExceptionOutlined />
            <span>{t('nav.BlackWhiteList')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('ImportExport')}>
            <SwapOutlined />
            <span>{t('nav.ImportExport')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('Privacy')}>
            <SafetyCertificateOutlined />
            <span>{t('nav.Privacy')}</span>
          </MenuItemWrap >
          <MenuItemWrap onChangeMenu={() => onChangeMenu('Permissions')}>
            <LockOutlined />
            <span>{t('nav.Permissions')}</span>
          </MenuItemWrap >
        </SidebarMenu>
      </SidebarProvider>
    </div>
  )
}

export const EntrySideBarMemo = React.memo(EntrySideBar)
