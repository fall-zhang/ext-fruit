import React from 'react'
import { withKnobs, text } from '@storybook/addon-knobs'
import { withSaladictPanel } from '@/_helpers/storybook'
import { EntryBox } from './index'

export default {
  title: 'Content Scripts|Components',

  decorators: [
    withKnobs,
    withSaladictPanel({
      head: <style>{require('./EntryBox.scss').toString()}</style>
    })
  ],

  parameters: {
    backgrounds: [
      { name: 'Saladict', value: '#5caf9e', default: true },
      { name: 'Black', value: '#000' },
      { name: 'White', value: '#fff' }
    ]
  }
}

export const _EntryBox = () => (
  <EntryBox title={text('Title', 'title text')}>
    {text(
      'Content',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt recusandae exercitationem minus autem repellendus soluta nulla laudantium nobis! Excepturi, dolorem. Doloremque exercitationem dolores voluptatum sint. Perspiciatis reiciendis doloribus mollitia nisi.'
    )}
  </EntryBox>
)

_EntryBox.story = {
  name: 'EntryBox'
}
