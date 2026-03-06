import React from 'react'
import { List } from 'antd'
import { useTranslation } from 'react-i18next'

export type Acknowledgement = Array<{
  name: string
  href: string
  locale: string
}>

export const acknowledgement: Acknowledgement = [
  {
    name: 'yipanhuasheng',
    href: 'https://github.com/crimx/ext-saladict/commits?author=yipanhuasheng',
    locale: 'yipanhuasheng',
  },
  {
    name: 'zhtw2013',
    href: 'https://github.com/crimx/ext-saladict/commits?author=zhtw2013',
    locale: 'trans_tw',
  },
  {
    name: 'lwdgit',
    href: 'https://github.com/crimx/ext-saladict/commits?author=lwdgit',
    locale: 'shanbay',
  },
  {
    name: 'Wekey',
    href: 'https://weibo.com/925515171?is_hot=1',
    locale: 'naver',
  },
  {
    name: 'caerlie',
    href: 'https://github.com/caerlie',
    locale: 'weblio',
  },
  {
    name: 'stockyman',
    href: 'https://github.com/stockyman',
    locale: 'trans_tw',
  },
]

export const AckList = React.memo(() => {
  const { t } = useTranslation('options')
  return (
    <List
      dataSource={acknowledgement.map((ack, i) => (
        <div key={i}>
          <a href={ack.href} rel="nofollow noopener noreferrer" target="_blank">
            {ack.name}
          </a>{' '}
          {t(`headInfo.acknowledgement.${ack.locale}`)}
        </div>
      ))}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  )
})
