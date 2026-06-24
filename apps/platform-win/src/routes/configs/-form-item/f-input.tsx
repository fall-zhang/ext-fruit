import { useFieldContext } from '../form-context'
import { Field, FieldDescription, FieldError, FieldLabel } from '@P/ui/components/field'
import { Input } from '@P/ui/components/input'
import { useId } from 'react'
export const FInput = (props: {
  label: string
  placeholder?: string
}) => {
  const inputId = useId()
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return <Field data-invalid={isInvalid} orientation='horizontal'>
    <FieldLabel htmlFor={inputId}>{props.label}</FieldLabel>
    <Input
      id={inputId}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
      placeholder={props.placeholder}
      autoComplete="off"
    />
    {/* <FieldDescription>
      This is your public display name. Must be between 3 and 10 characters.
      Must only contain letters, numbers, and underscores.
    </FieldDescription> */}
    {isInvalid && <FieldError errors={field.state.meta.errors} />}
  </Field>
}
