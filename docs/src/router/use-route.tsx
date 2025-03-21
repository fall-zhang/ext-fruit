/**
 * useRoute 创建的路由
 */
import React, { FC, Suspense } from 'react'
import { useRoutes, BrowserRouter } from 'react-router-dom'

import ErrorPage404 from '@/pages/err/404'
import ContactMe from '@/pages/contact'
import pageRoutes from './pageRoutes'
// 这里面使用的是 createRoutesFromChildren createBrowserRouter 生成的路由
import type { RouteObject } from 'react-router-dom'
const Susp = (path: string) => {
  // console.log("🚀 ~ file: use-route.tsx:13 ~ Susp ~ path:", path)
  const TempComponent = React.lazy(() => import(path))
  return <Suspense fallback={<>加载出错</>}>
    <TempComponent />
  </Suspense>
}

const BaseRoute = () => useRoutes([
  {
    path: '/icon',
    // element: Susp('@/pages/icon/index'),
    loader: () => import('@/pages/icon/index')
    // lazy: () => import('@/pages/icon/index'),
    // meta: { title: 'Icon选择', icon: <DesktopOutlined></DesktopOutlined> }
  }
])

export default function () {
  return <BrowserRouter>
    <BaseRoute></BaseRoute>
  </BrowserRouter>
}

