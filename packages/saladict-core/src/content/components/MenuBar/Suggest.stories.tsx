import React from 'react'
import { action } from '@storybook/addon-actions'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs, text } from '@storybook/addon-knobs'
import {
  withi18nNS,
  withSideEffect,
  withSaladictPanel,
  mockRuntimeMessage
} from '@/_helpers/storybook'
import { Suggest, SuggestItem } from './Suggest'
import { timer } from '@/_helpers/promise-more'
import suggestStyle from './Suggest.scss?raw'

export default {
  title: 'Content Scripts|Dict Panel/Menubar',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSaladictPanel({
      head: <style>{suggestStyle}</style>,
      height: 'auto',
      backgroundColor: 'transparent'
    }),
    withi18nNS('content'),
    withSideEffect(
      mockRuntimeMessage(async (message) => {
        if (message.type === 'GET_SUGGESTS') {
          await timer(Math.random() * 1500)
          return fakeSuggest(message.payload)
        }
      })
    )
  ],

  parameters: {
    backgrounds: [
      { name: 'Saladict', value: '#5caf9e', default: true },
      { name: 'Dark', value: '#222' },
      { name: 'Black', value: '#000' }
    ]
  }
}

export const _Suggest = () => {
  return (
    <Suggest
      text={text('Search text', 'text')}
      onSelect={action('Select')}
      onFocus={action('Focus')}
      onBlur={action('Blur')}
    />
  )
}

function fakeSuggest (text: string): SuggestItem[] {
  return Array.from(Array(10)).map((v, i) => ({
    explain: `单词 ${text} 的各种相近的建议#${i}`,
    entry: `Word ${text}#${i}`
  }))
}
