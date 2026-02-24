import { Controller, useForm, type Control, type ControllerProps } from 'react-hook-form'
import type * as React from 'react'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@P/ui/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea
} from '@P/ui/components/ui/input-group'
import type { FAdvanceForm } from './type'

export const FTextarea:FAdvanceForm<{
  min?:number
  max?:number
}> = ({
  name,
  control,
  label,
  onChange,
  max,
  min,
  description,
  placeholder,
}) => {
  return <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor="form-rhf-demo-description">
          {label}
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            {...field}
            id="form-rhf-demo-description"
            placeholder={placeholder}
            rows={6}
            className="min-h-24 resize-none"
            aria-invalid={fieldState.invalid}
          />
          {
            (max) && <InputGroupAddon align="block-end" >
              <InputGroupText className="tabular-nums">
                {field.value.length}/{max} characters
              </InputGroupText>
            </InputGroupAddon>
          }
          {
            (min) && <InputGroupAddon align="block-end" >
              <InputGroupText className="tabular-nums">
                {field.value.length} 字
              </InputGroupText>
            </InputGroupAddon>
          }

        </InputGroup>
        <FieldDescription>
          {description}
        </FieldDescription>
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        )}
      </Field>
    )}
  />
}
