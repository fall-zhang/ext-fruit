import i18n from '@/locales/i18n'
import type { FileRoutesByTo } from '@/routeTree.gen'
import { Button } from '@P/ui/components/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@P/ui/components/dropdown-menu'
import { cn } from '@P/ui/utils'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { BookmarkIcon, BookmarkPlus, FilePlusCornerIcon, FolderClosed, MoreVertical, SettingsIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})
const featureList: Array<{
  id: string,
  path: keyof FileRoutesByTo
  label: string
  icon: ReactNode
}> = [
  {
    id: 'notebook',
    path: '/notebook',
    label: i18n.t('生词本'),
    icon: <BookmarkIcon className="size-5" />,
  },
  {
    id: 'notebook-add',
    path: '/notebook-add',
    label: i18n.t('添加生词'),
    icon: <FilePlusCornerIcon className="size-5" />,
  },
  {
    id: 'general',
    path: '/configs/general',
    label: i18n.t('配置'),
    icon: <SettingsIcon className="size-5" />,
  },
  // 需要在重构完成配置后才能启用

]
function Index () {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {/* <h1 className='home-header text-5xl text-center'>欢迎使用水果沙拉查词</h1> */}
      {/* <Outlet /> */}
      {/* <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Folders</h2>
      </div> */}
      <div className="grid grid-cols-2 gap-3 w-120">
        {featureList.map((folder) => (
          <Link
            key={folder.id}
            to={folder.path}
            className={cn(
              'p-4 h-24 rounded-xl border bg-card hover:bg-accent/50 transition-all cursor-pointer group flex items-center'
            )}
          >
            <div className="flex items-start justify-between ">
              <div
                className="size-10 rounded-lg flex items-center justify-center"
              >
                {folder.icon}
              </div>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Open</DropdownMenuItem>
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
            <p className="font-medium text-sm truncate mb-0.5">{folder.label}</p>
            {/* <p className="text-xs text-muted-foreground">
                {folder.filesCount} files · {folder.size}
              </p> */}
          </Link>
        ))}
      </div>
    </div>
  )
}
