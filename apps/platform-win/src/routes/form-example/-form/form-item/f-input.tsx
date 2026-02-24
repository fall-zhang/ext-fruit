import { Controller, type ControllerProps } from 'react-hook-form'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@P/ui/components/ui/field'
import { Input } from '@P/ui/components/ui/input'
import { useId, type FC } from 'react'
import type { FBaseForm } from './type'
export const FInput:FBaseForm = ({
  name,
  control,
  label,
  onChange,
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
