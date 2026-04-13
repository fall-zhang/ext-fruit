import { Controller } from 'react-hook-form'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@P/ui/components/field'
import { Input } from '@P/ui/components/input'
import { useId } from 'react'
import type { FBaseForm } from './type'
export const FInput: FBaseForm = ({
  name,
  control,
  label,
  description,
  placeholder,
}) => {
  const inputId = useId()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={inputId}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            id={inputId}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete={name}
          />
          <FieldDescription>
            {description}
          </FieldDescription>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}
