import { createFileRoute } from '@tanstack/react-router'
import type * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type Control } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@P/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@P/ui/components/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@P/ui/components/field'
import type { AppConfig } from '@/config/app-config'
import { useConfContext } from '@/context/conf-context'
import { useCallback, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfirmContext } from '@/context/confirm-context'
import { setFormDirty } from './useDirtyForm'
import type { SaladictFormItem } from './type'
import { FInput } from './form-item/f-input'
import { FSwitch } from './form-item/f-switch'
import { FSelect } from './form-item/f-select'
import { useUpdateSetting } from '../../-utils/upload'

type ConfFormProps = {
  items: SaladictFormItem[]
}

export function ConfForm (props: ConfFormProps) {
  const configContext = useConfContext()
  const { t, i18n, ready } = useTranslation(['options', 'common'])
  // const dialogContext = useConfirmContext()
  const updateSetting = useUpdateSetting()


  const form = useForm<AppConfig>({
    defaultValues: configContext.config,
  })

  function onSubmit (data: AppConfig) {
    console.log('⚡️ line:46 ~ data: ', data)
    updateSetting(data)
    // toast('You submitted the following values:', {
    //   description: (
    //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    //   position: 'bottom-right',
    //   classNames: {
    //     content: 'flex flex-col gap-2',
    //   },
    //   style: {
    //     '--border-radius': 'calc(var(--radius)  + 4px)',
    //   } as React.CSSProperties,
    // })
  }
  const formId = useId()
  const genFormItems = useCallback((items: SaladictFormItem[]) => {
    return items.map((item) => {
      const name = 'config.' + (item.key || item.name)!
      const newItem: SaladictFormItem = { ...item }
      if (newItem.label === undefined) {
        newItem.label = t(name)
      }

      if (newItem.help === undefined) {
        const help = `options:${name}_help`
        if (ready && i18n.exists(help)) {
          newItem.help = t(help)
        }
      }

      if (newItem.extra === undefined) {
        const extra = `options:${name}_extra`
        if (ready && i18n.exists(extra)) {
          newItem.extra = t(extra)
        }
      }
      if (newItem.fromType === 'input') {
        return <FInput
          key={newItem.name}
          control={form.control}
          label={newItem.label}
          name={newItem.name}
        >
        </FInput>
      }
      if (newItem.fromType === 'switch') {
        return <FSwitch
          key={newItem.name}
          label={newItem.label}
          control={form.control}
          name={newItem.name}
        >
        </FSwitch>
      }
      if (newItem.fromType === 'select' && Array.isArray(newItem.options)) {
        return <FSelect
          key={newItem.name}
          label={newItem.label}
          control={form.control}
          name={newItem.name}
          items={newItem.options}
        >
        </FSelect>
      }
      if (newItem.fromType === 'custom' && newItem.customRender) {
        <Controller
          name={newItem.name}
          control={form.control}
          render={newItem.customRender as any}
        />
      }
      return <div key={newItem.name}>
        暂无对应的 formType - {newItem.fromType}
      </div>
    })
  }, [form.control, i18n, ready, t])

  return (
    <Card className="w-full">
      <CardContent>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} >
          <FieldGroup>
            {genFormItems(props.items)}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" variant='outline' form={formId}>
            {t('common:save')}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
