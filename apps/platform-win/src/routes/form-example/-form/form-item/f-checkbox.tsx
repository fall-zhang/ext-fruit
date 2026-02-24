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
import type { FBaseForm } from './type'

export const FCheckbox:FBaseForm = ({
  name,
  control,
  label,
  onChange,
  description,
  placeholder,
}) => {
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
                <Checkbox
                  id="form-rhf-checkbox-responses"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled
                />
                <FieldLabel
                  htmlFor="form-rhf-checkbox-responses"
                  className="font-normal"
                >
                  {label}
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
