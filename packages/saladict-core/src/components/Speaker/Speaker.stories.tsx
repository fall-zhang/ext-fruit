import React from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, number } from '@storybook/addon-knobs'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import {
  withSaladictPanel,
  withSideEffect,
  mockRuntimeMessage
} from '@/_helpers/storybook'
import {
  Speaker,
  StaticSpeakerContainer,
  getStaticSpeakerString,
  getStaticSpeaker
} from './index'
import { timer } from '@/_helpers/promise-more'
import { StrElm } from '../StrElm'

export default {
  title: 'Content Scripts|Components',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSideEffect(
      mockRuntimeMessage(async (message) => {
        if (message.type === 'PLAY_AUDIO') {
          action('Play Audio')(message.payload)
          await timer(Math.random() * 5000)
          action('Audio End')(message.payload)
        }
      })
    ),
    withSaladictPanel({
      head: <style>{require('./Speaker.scss').toString()}</style>
    })
  ]
}

export const _Speaker = () => {
  return (
    <Speaker
      width={number('Icon Width', 20)}
      height={number('Icon Height', 20)}
      src={text('Audio URL', 'https://example.com/a.mp3')}
    ></Speaker>
  )
}

export const _StaticSpeakerContainer = () => {
  const textStr = text(
    'Audio URL for getStaticSpeakerString',
    'https://example.com/a.mp3'
  )

  const textNode = text(
    'Audio URL for getStaticSpeaker',
    'https://example.com/b.mp3'
  )

  const node = getStaticSpeaker(textNode)

  return (
    <StaticSpeakerContainer
      onPlayStart={async (src) => action('On Play Start')(src)}
    >
      <StrElm
        html={`
          <p>${getStaticSpeakerString(textStr)} ${textStr}</p>
          <p>${node && node.outerHTML} ${textNode}</p>
        `}
      />
    </StaticSpeakerContainer>
  )
}

_StaticSpeakerContainer.story = {
  name: 'StaticSpeakerContainer'
}
