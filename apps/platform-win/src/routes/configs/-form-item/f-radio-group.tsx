import { useFieldContext } from '../form-context'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@P/ui/components/field'
import { RadioGroup, RadioGroupItem } from '@P/ui/components/radio-group'
import { useId } from 'react'
export const FRadioGroup = (props: {
  label: string
  placeholder?: string
  options: Array<{ label: string, value: string, description?: string }>
}) => {
  const textareaId = useId()
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return <FieldSet aria-orientation='horizontal'>
    <FieldLegend>{props.label}</FieldLegend>
    {/* <FieldDescription>
      You can upgrade or downgrade your plan at any time.
    </FieldDescription> */}
    <RadioGroup
      name={field.name}
      value={field.state.value}
      onValueChange={field.handleChange}
    >
      {props.options.map((plan) => (
        <FieldLabel
          key={plan.value}
          htmlFor={`radiogroup-${plan.value}_${textareaId}`}
        >
          <Field orientation="horizontal" data-invalid={isInvalid}>
            <FieldContent>
              <FieldTitle>{plan.label}</FieldTitle>
              <FieldDescription>{plan.description}</FieldDescription>
            </FieldContent>
            <RadioGroupItem
              value={plan.value}
              id={`radiogroup-${plan.value}_${textareaId}`}
              aria-invalid={isInvalid}
            />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
    {isInvalid && <FieldError errors={field.state.meta.errors} />}
  </FieldSet>
}
