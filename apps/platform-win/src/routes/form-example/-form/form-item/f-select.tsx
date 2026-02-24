import { Controller, useForm } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@P/ui/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@P/ui/components/ui/select'
import type { FAdvanceForm } from './type'

const spokenLanguages = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Italian', value: 'it' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Japanese', value: 'ja' },
] as const


export const FormRhfSelect:FAdvanceForm<{
  items:Array<{ label:string, value:string }>
}> = ({
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
        <Field
          orientation="responsive"
          data-invalid={fieldState.invalid}
        >
          <FieldContent>
            <FieldLabel htmlFor="form-rhf-select-language">
              {label}
            </FieldLabel>
            <FieldDescription>
              {description}
            </FieldDescription>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id="form-rhf-select-language"
              aria-invalid={fieldState.invalid}
              className="min-w-[120px]"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectSeparator />
              {spokenLanguages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  )
}
