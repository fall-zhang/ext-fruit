import type { JSXElementConstructor, ReactElement, ReactNode } from 'react'
import type { FieldValues, FieldPath, ControllerProps, ControllerFieldState, ControllerRenderProps, UseFormStateReturn } from 'react-hook-form'

export type FBaseForm = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, TTransformedValues = TFieldValues>(props: Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> & {
  name: string
  label?: ReactNode
  onChange?(newVal: string): void
  description?: string
  placeholder?: string
}) => ReactElement<unknown, string | JSXElementConstructor<any>>


/**
 * 和 react-hook-form 的 <Controller /> 一致
 */
export type FAdvanceForm<T extends object = object> = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, TTransformedValues = TFieldValues>(props: Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> & {
  name: string
  label?: ReactNode
  onChange?(newVal: string): void
  description?: string
  placeholder?: string
} & T) => ReactElement<unknown, string | JSXElementConstructor<any>>


export type OptionItem = {
  label: string
  value: string | number
}


export type CustomRender = ({ field, fieldState, formState }: {
  // field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
  field: any;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
}) => React.ReactElement
