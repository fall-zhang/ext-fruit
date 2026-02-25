import type { FC } from 'react'
import type { TFunction } from 'i18next'
import { Input, Button, Modal } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import type { DBArea } from '../../../core/database/types'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@sala/ui/components/navigation-menu'
export interface WordPageProps {
  t: TFunction
  area: DBArea
  searchText: string
  totalCount: number
  selectedCount: number
  onSearchTextChanged: (text: string) => void
  onExport(ev:React.MouseEvent):void
  onDelete: (key: string) => void
}

export const Header: FC<WordPageProps> = props => {
  const { t } = props
  const deleteConfirm = (key:'selected' | 'page' | 'all') => {
    if (key) {
      Modal.confirm({
        title: t('delete'),
        content: t(`delete.${key}`) + t('delete.confirm'),
        okType: 'danger',
        onOk: () => props.onDelete(`${key}`),
      })
    }
  }
  return (
    <div className="wordpage-Header flex z-100 w-full left-0 top-0 fixed">
      <div className="wordpage-Title">
        <h1 className="wordpage-Title_head">
          {t(`title.${props.area}`)}{' '}
          <small className="wordpage-Title_small">({t('localonly')})</small>
        </h1>
        <div style={{ whiteSpace: 'nowrap' }}>
          {props.totalCount > 0 && (
            <span className="wordpage-Wordcount">
              {t('wordCount.total', { count: props.totalCount })}
            </span>
          )}
          {props.selectedCount > 0 && (
            <span className="wordpage-Wordcount">
              {t('wordCount.selected', { count: props.selectedCount })}
            </span>
          )}
        </div>
      </div>
      <Input
        style={{ width: '15em' }}
        placeholder="Search"
        onChange={e => props.onSearchTextChanged(e.currentTarget.value)}
        value={props.searchText}
      />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <div>
                <div className='ml-2' onClick={props.onExport}>
                  {t('export.title')} <DownOutlined />
                </div>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96">
                {props.selectedCount > 0 && (
                  <ListItem key="selected">{t('export.selected')}</ListItem>
                )}
                <ListItem>{t('export.page')}</ListItem>
                <ListItem>{t('export.all')}</ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:flex">
            <NavigationMenuTrigger className='ml-2'>
              <div >
                {t('delete.title')} <DownOutlined />
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {props.selectedCount > 0 && (
                  <ListItem onClick={() => deleteConfirm('selected')} key="selected" >{t('delete.selected')}</ListItem>
                )}
                <ListItem onClick={() => deleteConfirm('page')} key="page">{t('delete.page')}</ListItem>
                <ListItem onClick={() => deleteConfirm('all')} key="all">{t('delete.all')}</ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

function ListItem ({
  title,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <div className="flex flex-col gap-1 text-sm">
          <div className="leading-none font-medium">{title}</div>
          <div className="text-muted-foreground line-clamp-2">{children}</div>
        </div>
      </NavigationMenuLink>
    </li>
  )
}
