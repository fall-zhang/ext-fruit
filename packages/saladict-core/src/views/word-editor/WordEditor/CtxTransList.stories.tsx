import { action } from '@storybook/addon-actions'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs } from '@storybook/addon-knobs'
import {
  withLocalStyle,
  withSideEffect,
  mockRuntimeMessage
} from '@/_helpers/storybook'
import faker from 'faker'
import getDefaultConfig from '@/app-config'
import { CtxTransList } from './CtxTransList'
import { CtxTranslateResults } from '@/_helpers/translateCtx'
import { newWord } from '@/_helpers/record-manager'

export default {
  title: 'Content Scripts|WordEditor',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSideEffect(
      mockRuntimeMessage(async (message) => {
        action(message.type)(message.payload)
      })
    )
  ]
}

export const _CtxTransList = () => {
  const config = getDefaultConfig()

  return (
    <CtxTransList
      word={newWord({
        date: faker.date.past().valueOf(),
        text: faker.random.word(),
        context: faker.lorem.sentence(),
        title: faker.random.word(),
        url: faker.internet.url(),
        favicon: faker.image.imageUrl(),
        trans: faker.lorem.sentence(),
        note: faker.lorem.sentences()
      })}
      ctxTransConfig={config.ctxTrans}
      ctxTransResult={Object.keys(config.ctxTrans).reduce((result, id) => {
        result[id] = faker.random.boolean() ? faker.lorem.paragraphs() : ''
        return result
      }, {} as CtxTranslateResults)}
      onNewCtxTransConfig={action('onNewCtxTransConfig')}
      onNewCtxTransResult={action('onNewCtxTransResult')}
    />
  )
}

_CtxTransList.story = {
  name: 'CtxTransList',

  parameters: {
    jsx: { skip: 1 }
  },

  decorators: [withLocalStyle(require('./CtxTransList.scss'))]
}
