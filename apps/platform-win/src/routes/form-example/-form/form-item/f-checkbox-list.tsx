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
import { useId } from 'react'


export const FCheckbox:FAdvanceForm<{
  items:Array<{ label:string, value:string }>
}> = ({
  name,
  control,
  label,
  onChange,
  description,
  items,
}) => {
  const formId = useId()
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <FieldGroup>
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend variant="label">{label}</FieldLegend>
              <FieldDescription>
                {description}
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                {items.map((task) => (
                  <Field
                    key={task.value}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id={`${formId}-${task.value}`}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value.includes(task.value)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, task.value]
                          : field.value.filter(
                            (value:string) => value !== task.value
                          )
                        field.onChange(newValue)
                      }}
                    />
                    <FieldLabel
                      htmlFor={`${formId}-${task.value}`}
                      className="font-normal"
                    >
                      {task.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
            </FieldSet>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </FieldGroup>
        )}
      />
    </>
  )
}
