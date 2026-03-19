import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import {
  ExceptionOutlined,
  KeyOutlined,
  DatabaseOutlined,
  SettingOutlined,
  BookOutlined,
  ProfileOutlined,
  FlagOutlined,
  SoundOutlined,
  FilePdfOutlined,
  LayoutOutlined,
  SwapOutlined,
  SafetyCertificateOutlined,
  LockOutlined
} from '@ant-design/icons'
import { cn } from '@P/ui/lib/utils'

export const Route = createFileRoute('/configs')({
  component: RouteComponent,
  notFoundComponent () {
    return <>配置找不到</>
  },
})

// 菜单项配置
const menuItems = [
  {
    id: 'black-white-list',
    path: '/configs/black-white-list',
    label: '黑名单/白名单',
    icon: <ExceptionOutlined className="w-4 h-4" />,
  },
  {
    id: 'dict-auth',
    path: '/configs/dict-auth',
    label: '词典认证',
    icon: <KeyOutlined className="w-4 h-4" />,
  },
  {
    id: 'context-menus',
    path: '/configs/context-menus',
    label: '右键菜单',
    icon: <DatabaseOutlined className="w-4 h-4" />,
  },
  {
    id: 'general',
    path: '/configs/general',
    label: '通用设置',
    icon: <SettingOutlined className="w-4 h-4" />,
  },
  {
    id: 'dictionaries',
    path: '/configs/dictionaries',
    label: '词典管理',
    icon: <BookOutlined className="w-4 h-4" />,
  },
  {
    id: 'dict-panel',
    path: '/configs/dict-panel',
    label: '词典面板',
    icon: <ProfileOutlined className="w-4 h-4" />,
  },
  {
    id: 'quick-search',
    path: '/configs/quick-search',
    label: '快速搜索',
    icon: <FlagOutlined className="w-4 h-4" />,
  },
  {
    id: 'pronunciation',
    path: '/configs/pronunciation',
    label: '发音设置',
    icon: <SoundOutlined className="w-4 h-4" />,
  },
  {
    id: 'pdf',
    path: '/configs/pdf',
    label: 'PDF设置',
    icon: <FilePdfOutlined className="w-4 h-4" />,
  },
  {
    id: 'popup',
    path: '/configs/popup',
    label: '弹出窗口',
    icon: <LayoutOutlined className="w-4 h-4" />,
  },
  {
    id: 'import-export',
    path: '/configs/import-export',
    label: '导入/导出',
    icon: <SwapOutlined className="w-4 h-4" />,
  },
  {
    id: 'privacy',
    path: '/configs/privacy',
    label: '隐私设置',
    icon: <SafetyCertificateOutlined className="w-4 h-4" />,
  },
  {
    id: 'permissions',
    path: '/configs/permissions',
    label: '权限管理',
    icon: <LockOutlined className="w-4 h-4" />,
  },
]

function RouteComponent () {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 左侧菜单栏 */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        {/* 标题区域 */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">配置中心</h1>
          <p className="text-sm text-gray-500 mt-1">管理您的词典和设置</p>
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
                  'hover:bg-blue-50 hover:text-blue-600',
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500 font-medium'
                    : 'text-gray-700 hover:border-l-4 hover:border-blue-200'
                )}
              >
                <div className={cn(
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

        {/* 底部信息 */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500">
            <p>当前版本: v0.2.1</p>
            <p className="mt-1">© 2024 Fruit Saladict</p>
          </div>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
