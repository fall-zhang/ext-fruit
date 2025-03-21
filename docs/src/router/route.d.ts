import type { ReactNode } from 'react'
// 路由meta
export interface RouteMeta {
  title: string
  hidden?: boolean
  auth?: string
  icon?: ReactNode
}
// 单条路由，路由下面最多嵌套一层菜单
// export type RouteParam = RouteObject
// RouteObject 上面没有存放数据的 meta 对象