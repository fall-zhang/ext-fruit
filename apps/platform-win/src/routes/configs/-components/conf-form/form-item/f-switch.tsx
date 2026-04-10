import { Controller, useForm } from 'react-hook-form'

import { Checkbox } from '@P/ui/components/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
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
        <div>
          <FieldSet data-invalid={fieldState.invalid}>
            <FieldLegend variant="label">{label}</FieldLegend>
            <FieldDescription>
              {description}
            </FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              <Field orientation="horizontal">
                <Switch
                  id={formId}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(ev) => {
                    field.onChange(ev)
                  }}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel
                  htmlFor={formId}
                  className="font-normal"
                >
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </div>
      )}
    />
  )
}
