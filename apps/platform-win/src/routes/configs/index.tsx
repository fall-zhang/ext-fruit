import { MainConfigPage } from '@P/saladict-core/src/views/options'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/configs/')({
  component: RouteComponent,
})

function RouteComponent () {
  const config = {}
  function updateConf (newConf:unknown) {


  }
  return <div>
    <MainConfigPage ></MainConfigPage>
  </div>
}
