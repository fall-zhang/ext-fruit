import { useFieldContext } from '../form-context'
import { Field, FieldError, FieldLabel } from '@P/ui/components/field'
import { Slider } from '@P/ui/components/slider'
import { useId } from 'react'
export const FSlider = (props: {
  label: string
  placeholder?: string
}) => {
  const inputId = useId()
  const field = useFieldContext<number>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return <Field data-invalid={isInvalid} orientation='horizontal'>
    <FieldLabel htmlFor={inputId}>{props.label}</FieldLabel>
    <Slider
      id={inputId}
      name={field.name}
      defaultValue={[field.state.value]}
      max={100}
      step={1}
      onValueChange={(newVal) => {
        field.handleChange(newVal[0])
      }}
      orientation="vertical"
      className="h-40"
    />
    {/* <FieldDescription>
      This is your public display name. Must be between 3 and 10 characters.
      Must only contain letters, numbers, and underscores.
    </FieldDescription> */}
    {isInvalid && <FieldError errors={field.state.meta.errors} />}
  </Field>
}
