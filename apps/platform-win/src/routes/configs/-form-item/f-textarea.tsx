import { useFieldContext } from '../form-context'
import { Field, FieldError, FieldLabel } from '@P/ui/components/field'
import { Textarea } from '@P/ui/components/textarea'
import { useId } from 'react'
export const FTextarea = (props: {
  label: string
  placeholder?: string
}) => {
  const textareaId = useId()
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return <Field data-invalid={isInvalid} orientation='horizontal'>
    <FieldLabel htmlFor={textareaId}>
      {props.label}
    </FieldLabel>
    <Textarea
      id={textareaId}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
      placeholder={props.placeholder}
      className="min-h-30"
    />
    {/* <FieldDescription>
      Tell us more about yourself. This will be used to help us personalize
      your experience.
    </FieldDescription> */}
    {isInvalid && <FieldError errors={field.state.meta.errors} />}
  </Field>
}
