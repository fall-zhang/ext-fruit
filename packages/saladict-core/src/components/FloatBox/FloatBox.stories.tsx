import React from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withSaladictPanel, withi18nNS } from '@/_helpers/storybook'
import faker from 'faker'
import { FloatBox } from '.'

export default {
  title: 'Content Scripts|Components',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSaladictPanel({
      head: (
        <>
          <style>{require('./FloatBox.scss').toString()}</style>
          <style>{'.dictPanel-Root { padding: 20px; }'}</style>
        </>
      )
    }),
    withi18nNS('content')
  ],

  parameters: {
    backgrounds: [
      { name: 'Saladict', value: '#5caf9e', default: true },
      { name: 'Black', value: '#000' }
    ]
  }
}

export const _FloatBox = () => {
  return (
    <FloatBox
      list={
        boolean('Loading', false)
          ? undefined
          : uniqueWordList(15).map((word) => {
            return faker.random.boolean()
              ? {
                key: word,
                value: word,
                label: word
              }
              : {
                key: word,
                value: word,
                options: [
                  { value: word, label: word },
                  ...uniqueWordList(15).map((word) => {
                    return { value: word, label: word }
                  })
                ]
              }
          })
      }
      compact={boolean('Compact', true)}
      onSelect={action('onSelect')}
      onFocus={() => action('onFocus')('...node')}
      onBlur={() => action('onBlur')('...node')}
      onMouseOver={() => action('onMouseOver')('...node')}
      onMouseOut={() => action('onMouseOut')('...node')}
      onArrowUpFirst={() => action('onArrowUpFirst')('...node')}
      onArrowDownLast={() => action('onArrowDownLast')('...node')}
      onClose={action('onClose')}
      onHeightChanged={action('onHeightChanged')}
    />
  )
}

_FloatBox.story = {
  name: 'FloatBox'
}

function uniqueWordList (max: number): string[] {
  return [
    ...new Set(
      Array(faker.random.number(max))
        .fill(0)
        .map(() => faker.random.word())
    )
  ]
}
