import { createFileRoute, Link, Outlet, useLocation, redirect } from '@tanstack/react-router'
import {
  LayoutOutlined,
  ProfileOutlined,
  SwapOutlined,
  SoundOutlined
} from '@ant-design/icons'
import { cn } from '@P/ui/lib/utils'
import i18n from '@/locales/i18n'
import { ConfirmProvider } from '@/context/confirm-context'

import { TooltipProvider } from '@P/ui/components/tooltip'
import { InfoIcon, SettingsIcon } from 'lucide-react'

export const Route = createFileRoute('/configs')({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    console.log('⚡️ line:18 ~ location: ', location)
    // 如果当前路径正好是 /configs，重定向到 /configs/general
    if (location.pathname === '/configs') {
      throw redirect({
        to: '/configs/general',
        replace: true,
      })
    }
  },
  notFoundComponent () {
    return <>配置找不到</>
  },
})

// 菜单项配置
const menuItems = [
  {
    id: 'general',
    path: '/configs/general',
    label: i18n.t('options:nav.General'),
    icon: <SettingsIcon className="w-4 h-4" />,
  },
  // 需要在重构完成配置后才能启用
  // {
  //   id: 'dictionaries',
  //   path: '/configs/dictionaries',
  //   label: '词典配置',
  //   icon: <FlagOutlined className="w-4 h-4" />,
  // },
  // {
  //   id: 'dict-auth',
  //   path: '/configs/dict-auth',
  //   label: i18n.t('options:nav.DictAuths'),
  //   icon: <KeyOutlined className="w-4 h-4" />,
  // },
  {
    id: 'dict-panel',
    path: '/configs/dict-panel',
    label: i18n.t('options:nav.DictPanel'),
    icon: <ProfileOutlined className="w-4 h-4" />,
  },
  {
    id: 'pronunciation',
    path: '/configs/pronunciation',
    label: i18n.t('options:nav.Pronunciation'),
    icon: <SoundOutlined className="w-4 h-4" />,
  },
  {
    id: 'import-export',
    path: '/configs/import-export',
    label: i18n.t('options:nav.ImportExport'),
    icon: <SwapOutlined className="w-4 h-4" />,
  },
  {
    id: 'app-info',
    path: '/configs/app-info',
    label: '应用信息',
    icon: <InfoIcon className="w-4 h-4" />,
  },
  // {
  //   id: 'quick-search',
  //   path: '/configs/quick-search',
  //   label: '快速搜索',
  //   icon: <FlagOutlined className="w-4 h-4" />,
  // },
  // {
  //   id: 'privacy',
  //   path: '/configs/privacy',
  //   label: '隐私设置',
  //   icon: <SafetyCertificateOutlined className="w-4 h-4" />,
  // },
  // {
  //   id: 'permissions',
  //   path: '/configs/permissions',
  //   label: '权限管理',
  //   icon: <LockOutlined className="w-4 h-4" />,
  // },
  // {
  //   id: 'window-communication',
  //   path: '/configs/window-communication',
  //   label: '窗口通信示例',
  //   icon: <CloudServerOutlined className="w-4 h-4" />,
  // },
]

function RouteComponent () {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <ConfirmProvider>
      <TooltipProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 dark:text-neutral-100">
          {/* 左侧菜单栏 */}
          <div className="w-52 bg-white border-r border-gray-200 shadow-sm flex flex-col dark:bg-neutral-900 dark:text-neutral-100">
            {/* 标题区域 */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">配置中心</h2>
              {/* <p className="text-sm text-gray-500 mt-1">管理您的词典和设置</p> */}
            </div>

            {/* 菜单列表 */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/')
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      'hover:bg-blue-50 dark:hover:bg-neutral-700 dark:text-white hover:text-neutral-200',
                      isActive
                        ? 'bg-blue-50  dark:bg-neutral-700 border-l-4 border-blue-500 font-medium'
                        : 'text-neutral-700 dark:text-neutral-400 hover:border-l-4 hover:border-blue-200 hover:dark:border-neutral-500 '
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center',
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      )}>
                      {item.icon}
                    </div>
                    <span className="text-sm">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 p-6 h-screen max-w-6xl mx-auto overflow-auto">
            <Outlet />
          </div>
        </div>
      </TooltipProvider>
    </ConfirmProvider>

  )
}
