import React, { FC, useState } from 'react'
import i18next from 'i18next'
import { action } from '@storybook/addon-actions'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import {
  withi18nNS,
  withSideEffect,
  withSaladictPanel,
  mockRuntimeMessage
} from '@/_helpers/storybook'
import { SuggestItem } from './Suggest'
import { SearchBox } from './SearchBox'
import { timer } from '@/_helpers/promise-more'
import { useTranslate } from '@/_helpers/i18n'
import SearchBoxStyle from './SearchBox.scss?raw'
export default {
  title: 'Content Scripts|Dict Panel/Menubar',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    (story) => <BtnsParent story={story} />,
    withSaladictPanel({
      head: <style>{SearchBoxStyle}</style>,
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
    ),
    (Story) => <Story />
  ],

  parameters: {
    backgrounds: [
      { name: 'Saladict', value: '#5caf9e', default: true },
      { name: 'Black', value: '#000' }
    ]
  }
}

export const BaseSearchBox:FC = () => {
  const [text, setText] = useState('text')
  return (
    <SearchBox
      t={i18next.getFixedT(i18next.language, 'content')}
      text={text}
      shouldFocus={boolean('Focus On Mount', true)}
      enableSuggest={boolean('Enable Suggest', true)}
      onInput={(text) => {
        setText(text)
        action('Input')(text)
      }}
      onSearch={(text) => {
        setText(text)
        action('Search')(text)
      }}
      onHeightChanged={action('Height Changed')}
    />
  )
}

function fakeSuggest (text: string): SuggestItem[] {
  return Array.from(Array(10)).map((v, i) => ({
    explain: `单词 ${text} 的各种相近的建议#${i}`,
    entry: `Word ${text}#${i}`
  }))
}

function BtnsParent (props: { story: any }) {
  const { t } = useTranslate('content')
  return <>{props.story(t)}</>
}
