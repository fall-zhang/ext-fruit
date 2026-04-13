import { createFileRoute } from '@tanstack/react-router'
import { useRef, type FC } from 'react'


import { useTranslation } from 'react-i18next'
import { ConfForm } from '../-components/conf-form/conf-form'
import { Slider } from '@P/ui/components/slider'


export const RouteComponent: FC = () => {
  const { t } = useTranslation('options')
  const { availWidth } = window.screen
  const ref = useRef({})
  return (<>
    <ConfForm
      items={[
        {
          name: 'waveform',
          fromType: 'switch',
        },
        {
          name: 'searchSuggests',
          fromType: 'switch',
        },
        {
          name: 'animation',
          fromType: 'switch',
        },
        {
          name: 'panelWidth',
          fromType: 'switch',
        },
        {
          name: 'panelWidth',
          fromType: 'custom',
          customRender: ({ field }) => (
            <Slider
              {...field}
              defaultValue={[field.value]}
              onValueChange={newVal => {
                field.onChange(newVal[0])
              }}
              min={250}
              max={availWidth}
            />
          ),
        },
      ]}>
    </ConfForm>
    {/*
        {
          name: getConfigPath('windowPinned'),
          children: <Switch />,
        },
        {
          name: getConfigPath('animation'),
          children: <Switch />,
        },
        {
          name: getConfigPath('fontSize'),
          children: (
            <Slider
              min={8}
              max={30}
              marks={{ 8: '8px', 30: '30px' }} />
          ),
        },
        {
          name: getConfigPath('bowlOffsetX'),
          children: (
            <Slider
              min={-100}
              max={100}
              marks={{ '-100': '-100px', 0: '0px', 100: '100px' }} />
          ),
        },
        {
          name: getConfigPath('bowlOffsetY'),
          children: (
            <Slider
              min={-100}
              max={100}
              marks={{ '-100': '-100px', 0: '0px', 100: '100px' }} />
          ),
        },
   */}
  </>
  )
}


export const Route = createFileRoute('/configs/dict-panel/')({
  component: RouteComponent,
})
