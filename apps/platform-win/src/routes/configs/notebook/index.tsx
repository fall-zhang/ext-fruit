import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/configs/notebook/')({
  component: RouteComponent,
})
// 单词同步配置
function RouteComponent () {
  return <div>Hello</div>
}
