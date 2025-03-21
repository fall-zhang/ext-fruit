import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs } from '@storybook/addon-knobs'
import { withSaladictPanel } from '@/_helpers/storybook'
import faker from 'faker'
import { MtaBox } from './MtaBox'

export default {
  title: 'Content Scripts|Dict Panel',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSaladictPanel({
      head: <style>{require('./MtaBox.scss').toString()}</style>
    }),
    (Story) => <Story />
  ],

  parameters: {
    backgrounds: [
      { name: 'Saladict', value: '#5caf9e', default: true },
      { name: 'Black', value: '#000' }
    ]
  }
}

export const _MtaBox = () => {
  const [expand, setExpand] = useState(true)
  const [text, setText] = useState(() => faker.lorem.paragraph(2))

  return (
    <MtaBox
      expand={expand}
      text={text}
      shouldFocus={true}
      searchText={action('Search Text')}
      onInput={(text) => {
        action('Input')(text)
        setText(text)
      }}
      onDrawerToggle={() => {
        action('Drawer Toggle')()
        setExpand(!expand)
      }}
      onHeightChanged={action('Height Changed')}
    />
  )
}

_MtaBox.story = {
  name: 'MtaBox'
}
