import React from 'react'
import {
  GithubOutlined
} from '@ant-design/icons'
const pageRoutes = [
  {
    path: '/contact',
    element: React.lazy(() => import('@/pages/contact/index')),
    meta: { title: '联系方式', icon: <GithubOutlined></GithubOutlined> }
  }
]
export default pageRoutes
