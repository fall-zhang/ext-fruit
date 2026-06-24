import { useFieldContext } from '../form-context'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@P/ui/components/field'
import { Switch } from '@P/ui/components/switch'
import { useId } from 'react'
export const FSwitch = (props: {
  label: string
}) => {
  const inputId = useId()
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return <Field orientation="horizontal" data-invalid={isInvalid}>
    <FieldContent>
      <FieldLabel htmlFor={inputId}>
        {props.label}
      </FieldLabel>
      {/* <FieldDescription>
        Enable multi-factor authentication to secure your account.
      </FieldDescription> */}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldContent>
    <Switch
      id={inputId}
      name={field.name}
      checked={field.state.value}
      onCheckedChange={field.handleChange}
      aria-invalid={isInvalid}
    />
  </Field>
}
