import * as React from 'react'
import { Button } from '@P/ui/components/ui/button'
import { Calendar } from '@P/ui/components/ui/calendar'
import { Field, FieldLabel } from '@P/ui/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@P/ui/components/ui/popover'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

export function DatePickerWithRange () {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })


  let dateText:React.ReactNode = <span>Pick a date</span>
  if (date?.from) {
    if (date.to) {
      dateText = <>
        {format(date.from, 'LLL dd, y')} -{' '}
        {format(date.to, 'LLL dd, y')}
      </>
    } else {
      dateText = (
        format(date.from, 'LLL dd, y')
      )
    }
  }

  return (
    <Field className="mx-auto w-60">
      <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {dateText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
