import { Controller, useForm } from 'react-hook-form'

import { Checkbox } from '@P/ui/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from '@P/ui/components/ui/field'
import type { FAdvanceForm, FBaseForm } from './type'
import { useId, type ReactNode } from 'react'

const tasks = [
  {
    id: 'push',
    label: 'Push notifications',
  },
  {
    id: 'email',
    label: 'Email notifications',
  },
]


export const FCheckbox:FAdvanceForm<{
  children:ReactNode
}> = ({
  name,
  control,
  label,
  onChange,
  description,
  children,
}) => {
  const formId = useId()
  return (
    <>
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
                  <Checkbox
                    id={formId}
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                  />
                  <FieldLabel
                    htmlFor={formId}
                    className="font-normal"
                  >
                    {children}
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
    </>
  )
}
