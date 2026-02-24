import { createFileRoute } from '@tanstack/react-router'
import type * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@P/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@P/ui/components/ui/card'
import {
  Field,
  FieldGroup
} from '@P/ui/components/ui/field'
import { FInput } from './form-item/f-input'
import { FTextarea } from './form-item/f-textarea'

export const Route = createFileRoute('/form-example/')({
  component: RouteComponent,
})

const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Bug title must be at least 5 characters.')
    .max(32, 'Bug title must be at most 32 characters.'),
  description: z
    .string(),
  // .min(20, 'Description must be at least 20 characters.')
  // .max(100, 'Description must be at most 100 characters.'),
})

function RouteComponent () {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  console.log('⚡️ line:49 ~ form: ', form.getValues())
  function onSubmit (data: z.infer<typeof formSchema>) {
    console.log('⚡️ line:58 ~ data: ', data)
    toast('You submitted the following values:', {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
      classNames: {
        content: 'flex flex-col gap-2',
      },
      style: {
        '--border-radius': 'calc(var(--radius)  + 4px)',
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} >
          <FieldGroup>
            <FInput
              name='title'
              control={form.control}
            ></FInput>
            <FTextarea
              name='description'
              control={form.control}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form='form-rhf-demo'>
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
