import { createFileRoute } from '@tanstack/react-router'
import { useRef, type FC } from 'react'
import { Input, Select, Switch, Slider } from 'antd'


import { useTranslation } from 'react-i18next'
import { SaladictForm } from '../-components/SaladictForm'
import { getConfigPath, getProfilePath } from '../-utils/path-joiner'


export const RouteComponent: FC = () => {
  const { t } = useTranslation('options')
  const { availWidth } = window.screen
  const ref = useRef({})
  return (
    <SaladictForm
      ref={ref}
      items={[
        {
          name: getConfigPath('waveform'),
          children: <Switch />,
        },
        {
          name: getConfigPath('searchSuggests'),
          children: <Switch />,
        },
        {
          name: getConfigPath('windowPinned'),
          children: <Switch />,
        },
        {
          name: getConfigPath('animation'),
          children: <Switch />,
        },
        // {
        //   name: getConfigPath('panelMaxHeightRatio'),
        //   children: (
        //     <Slider
        //       min={0}
        //       max={100}
        //       marks={{ 0: '0%', 80: '80%', 100: '100%' }} />
        //   ),
        // },
        {
          name: getConfigPath('panelWidth'),
          children: (
            <Slider
              min={250}
              max={availWidth}
              marks={{
                250: '250px',
                450: '450px',
                [availWidth]: `${availWidth}px`,
              }} />
          ),
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
        {
          name: getConfigPath('panelCSS'),
          extra: (
            <a
              href="https://github.com/crimx/ext-saladict/wiki/PanelCSS#wiki-content"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Examples
            </a>
          ),
          children: (
            <Input.TextArea
              placeholder=".dictPanel-Root { }"
              autoSize={{ minRows: 4, maxRows: 15 }} />
          ),
        },
      ]} />
  )
}


export const Route = createFileRoute('/configs/dict-panel/')({
  component: RouteComponent,
})
