import React from 'react'
import { action } from '@storybook/addon-actions'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs, boolean, number } from '@storybook/addon-knobs'
import { WordEditor } from './WordEditor'
import {
  withLocalStyle,
  withSideEffect,
  mockRuntimeMessage,
  withi18nNS
} from '@/_helpers/storybook'
import faker from 'faker'
import { newWord } from '@/_helpers/record-manager'
import getDefaultConfig from '@/app-config'
import WordEditorPortal from './WordEditor.portal'

export default {
  title: 'Content Scripts|WordEditor',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSideEffect(
      mockRuntimeMessage(async (message) => {
        action(message.type)(message.payload)
        switch (message.type) {
        case 'GET_WORDS_BY_TEXT':
          return faker.random.boolean()
            ? [
              newWord({
                date: faker.date.past().valueOf(),
                text: message.payload.text,
                context: faker.lorem.sentence(),
                title: faker.random.word(),
                url: faker.internet.url(),
                favicon: faker.image.imageUrl(),
                trans: faker.lorem.sentence(),
                note: faker.lorem.sentences()
              })
            ]
            : []
        }
      })
    ),
    withi18nNS(['common', 'content'])
  ]
}

export const _WordEditor = () => {
  const config = getDefaultConfig()
  const darkMode = boolean('Dark Mode', false)

  return (
    <WordEditor
      containerWidth={number('Panel X', 450 + 100)}
      darkMode={darkMode}
      wordEditor={{
        word: newWord({
          date: faker.date.past().valueOf(),
          text: faker.random.word(),
          context: faker.lorem.sentence(),
          title: faker.random.word(),
          url: faker.internet.url(),
          favicon: faker.image.imageUrl(),
          trans: faker.lorem.sentence(),
          note: faker.lorem.sentences()
        }),
        translateCtx: false
      }}
      ctxTrans={config.ctxTrans}
      onClose={action('Close')}
    />
  )
}

_WordEditor.story = {
  name: 'WordEditor',

  parameters: {
    jsx: { skip: 1 }
  },

  decorators: [withLocalStyle(require('./WordEditor.scss'))]
}

export const _WordEditorPortal = () => {
  const config = getDefaultConfig()
  const darkMode = boolean('Dark Mode', false)

  return (
    <WordEditorPortal
      show={boolean('Show', true)}
      darkMode={darkMode}
      withAnimation={boolean('With Animation', true)}
      containerWidth={number('Panel X', 450 + 100)}
      wordEditor={{
        word: newWord({
          date: faker.date.past().valueOf(),
          text: faker.random.word(),
          context: faker.lorem.sentence(),
          title: faker.random.word(),
          url: faker.internet.url(),
          favicon: faker.image.imageUrl(),
          trans: faker.lorem.sentence(),
          note: faker.lorem.sentences()
        }),
        translateCtx: false
      }}
      ctxTrans={config.ctxTrans}
      onClose={action('Close')}
    />
  )
}

_WordEditorPortal.story = {
  name: 'WordEditorPortal'
}
