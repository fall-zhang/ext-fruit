import { Controller, useForm } from 'react-hook-form'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from '@P/ui/components/field'
import type { FAdvanceForm, FBaseForm } from './type'
import { useId, type ReactNode } from 'react'
import { Switch } from '@P/ui/components/switch'

export const FSwitch: FAdvanceForm = ({
  name,
  control,
  label,
  description,
}) => {
  const formId = useId()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" className='flex justify-start'>
          <FieldContent data-invalid={fieldState.invalid}>
            <FieldLabel >{label}</FieldLabel>
            <FieldDescription>
              {description}
            </FieldDescription>
          </FieldContent>
          <Switch
            id={formId}
            name={field.name}
            checked={field.value}
            onCheckedChange={(ev) => {
              field.onChange(ev)
            }}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}
