/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import type { AppConfig } from '@/config/app-config'
import { useId } from 'react'
import { useConfContext } from '@/context/conf-context/context'
import { useAppForm } from '../form-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme-context'
export const Route = createFileRoute('/configs/general/')({
  component: RouteComponent,
})

function RouteComponent () {
  // const formRef = useRef<HTMLFormElement>(null)
  const formId = useId()
  const configContext = useConfContext()

  const { t } = useTranslation('options')
  const form = useAppForm({
    defaultValues: configContext.config,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })
  function onConfUpdate () {
    const appConf: AppConfig = form.state.values
    configContext.updateConfig(appConf)
  }
  const theme = useTheme()

  return <div className='flex flex-col h-full'>
    <form
      className='border border-neutral-300 dark:border-neutral-700 rounded-3xl h-full py-4 px-6'
      id={formId} onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
      <form.AppField
        name='appTheme'
        listeners={{
          onChange: ({ value }) => {
            // console.log('⚡️ line:40 ~ value: ', value)
            theme.setTheme(value)
            onConfUpdate()
          },
        }}
        children={(field) => <field.FSelect
          label={t('config.appTheme')}
          options={[
            { label: '跟随系统', value: 'system' },
            { label: '黑暗模式', value: 'dark' },
            { label: '亮色模式', value: 'light' },
          ]}/>
        } />
      {/* <form.AppField name='touchMode' /> */}
      {/* <form.Subscribe selector={state => state.values.appTheme === 'dark'} children={form => (<form.AppField />)}/> */}
    </form>
    {/* <ConfForm items={formItems} onChange={onConfUpdate}></ConfForm> */}
  </div>
}

// const formItems: SaladictFormItem[] = [
//     {
//       name: 'appTheme',
//       fromType: 'select',
//       options: [
//         { label: '跟随系统', value: 'system' },
//         { label: '黑暗模式', value: 'dark' },
//         { label: '亮色模式', value: 'light' },
//       ],
//     },
//     {
//       name: 'updateCheck',
//       fromType: 'switch',
//     },
//     {
//       name: 'searchHistory',
//       fromType: 'switch',
//     },
//     {
//       name: 'startOnBoot',
//       fromType: 'switch',
//     },
//     {
//       name: 'langCode',
//       fromType: 'select',
//       options: [
//         { label: '简体中文', value: 'zh-CN' },
//         { label: '繁體中文', value: 'zh-TW' },
//         { label: 'English', value: 'en' },
//       ],
//     },
//   ]
//   function onConfUpdate (appConfig: AppConfig) {
//   }
