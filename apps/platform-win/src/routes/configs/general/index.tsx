import { createFileRoute } from '@tanstack/react-router'

import { ConfForm } from '../-components/conf-form/conf-form'
import type { SaladictFormItem } from '../-components/conf-form/type'
export const Route = createFileRoute('/configs/general/')({
  component: RouteComponent,
})

function RouteComponent () {
  // const formRef = useRef<HTMLFormElement>(null)
  const formItems: SaladictFormItem[] = [
    {
      name: 'appTheme',
      fromType: 'select',
      options: [
        { label: '跟随系统', value: 'system' },
        { label: '黑暗模式', value: 'dark' },
        { label: '亮色模式', value: 'light' },
      ],
    },
    {
      name: 'updateCheck',
      fromType: 'switch',
    },
    {
      name: 'searchHistory',
      fromType: 'switch',
    },
    {
      name: 'startOnBoot',
      fromType: 'switch',
    },
    {
      name: 'langCode',
      fromType: 'select',
      options: [
        { label: '简体中文', value: 'zh-CN' },
        { label: '繁體中文', value: 'zh-TW' },
        { label: 'English', value: 'en' },
      ],
    },
  ]

  return <div className='flex flex-col h-full'>
    {/* <SaladictForm items={formItems} ref={formRef} /> */}
    <ConfForm items={formItems}></ConfForm>
    {/* <div className="">
      <Button variant={'destructive'}>重置所有配置</Button>
    </div> */}
  </div>
}
