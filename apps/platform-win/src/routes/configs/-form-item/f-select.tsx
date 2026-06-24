import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@P/ui/components/select'
import { useFieldContext } from '../form-context'
import { Field, FieldError, FieldLabel } from '@P/ui/components/field'
export const FSelect = (props: {
  label: string
  placeholder?: string
  options: Array<{ label: string, value: string }>
}) => {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return <Field data-invalid={isInvalid} orientation='horizontal'>
    <FieldLabel htmlFor={field.name}>{props.label}</FieldLabel>
    <Select
      name={field.name}
      value={field.state.value}
      onValueChange={field.handleChange}
    >
      <SelectTrigger
        id="form-tanstack-select-language"
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        className="min-w-30"
      >
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {
          props.options.map((item, index) => {
            return <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
          })
        }
      </SelectContent>
    </Select>
    {/* <FieldDescription>
      Choose how often you want to be billed.
    </FieldDescription> */}
    {isInvalid && (
      <FieldError errors={field.state.meta.errors} />
    )}
  </Field>
}
