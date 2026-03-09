import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type Control } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@salad/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@salad/ui/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@salad/ui/components/ui/field'
import { Input } from '@salad/ui/components/ui/input'
import type { FC } from 'react'

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(10, 'Username must be at most 10 characters.')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores.'
    ),
})

export const FormRhfInput:FC<{
  name:string
  control:Control
  label:string
  onChange:string
  description:string
}> = ({
  name,
  control,
  label,
  onChange,
  description,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },

  })

  function onSubmit (data: z.infer<typeof formSchema>) {
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

  return (<>
    <FieldGroup>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-input-username">
              {label}
            </FieldLabel>
            <Input
              {...field}
              id="form-rhf-input-username"
              aria-invalid={fieldState.invalid}
              placeholder="shadcn"
              autoComplete="username"
            />
            <FieldDescription>
              This is your public display name. Must be between 3 and 10
              characters. Must only contain letters, numbers, and
              underscores.
            </FieldDescription>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  </>
  )
}
