import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@P/ui/components/ui/field'
import type { FBaseForm } from './type'
import * as React from 'react'
import { Button } from '@P/ui/components/ui/button'
import { Calendar } from '@P/ui/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@P/ui/components/ui/popover'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Controller } from 'react-hook-form'

export const FDatePicker:FBaseForm = ({
  name,
  control,
  label,
  onChange,
  description,
  placeholder,
}) => {
  const [date, setDate] = React.useState<DateRange >({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })
  const formId = React.useId()

  let currentDate:React.ReactNode
  if (date.from) {
    if (date.to) {
      currentDate = <>
        {format(date.from, 'LLL dd, y')} -{' '}
        {format(date.to, 'LLL dd, y')}
      </>
    } else {
      currentDate = format(date.from, 'LLL dd, y')
    }
  } else {
    currentDate = <span>{placeholder}</span>
    // currentDate = <span>Pick a date</span>
  }
  function onChangeDate (newDate:DateRange) {
    // onChange(newDate)
  }

  return (
    <Controller
      name={name}
      control={control}
      render={ ({ field, fieldState }) => (<Field className="mx-auto w-60">
        <FieldLabel htmlFor={formId}>{label}</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={formId}
              className="justify-start px-2.5 font-normal"
            >
              <CalendarIcon />
              {currentDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              required
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(newDate) => {
                field.onChange(newDate)
                onChangeDate(newDate)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {description && (
          <span>{description}</span>
        )
        }
      </Field>)
      }
    >

    </Controller>
  )
}
