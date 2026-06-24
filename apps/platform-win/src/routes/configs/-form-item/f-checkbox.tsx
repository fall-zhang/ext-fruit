
import { Checkbox } from '@P/ui/components/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@P/ui/components/field'
import { useFieldContext } from '../form-context'
import { useId } from 'react'

export const FCheckbox = (props: {
  label: string
  description: string
  options: Array<{ label: string, value: string }>
}) => {
  const formId = useId()
  const field = useFieldContext<string[]>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet area-orientation='horizontal'>
      <FieldLegend variant="label">{props.label}</FieldLegend>
      <FieldDescription>
        {props.description}
      </FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {props.options.map((task) => (
          <Field
            key={task.value}
            orientation="horizontal"
            data-invalid={isInvalid}
          >
            <Checkbox
              id={formId + `_checkbox-${task.value}`}
              name={field.name}
              aria-invalid={isInvalid}
              checked={field.state.value.includes(task.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  field.pushValue(task.value)
                } else {
                  const index = field.state.value.indexOf(task.value)
                  if (index > -1) {
                    field.removeValue(index)
                  }
                }
              }}
            />
            <FieldLabel
              htmlFor={formId + `_checkbox-${task.value}`}
              className="font-normal"
            >
              {task.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  )
}
