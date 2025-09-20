import React from 'react'
import i18next from 'i18next'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs, select } from '@storybook/addon-knobs'
import { withi18nNS, withSaladictPanel } from '@/_helpers/storybook'
import { Profiles } from './Profiles'
import { action } from '@storybook/addon-actions'
import profilesStyle from './Profiles.scss?raw'
export default {
  title: 'Content Scripts|Dict Panel/Menubar',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSaladictPanel({
      head: <style>{profilesStyle}</style>,
      backgroundColor: 'transparent'
    }),
    (stroy) => <div style={{ marginLeft: 50 }}>{stroy()}</div>,
    withi18nNS('content')
  ],

  parameters: {
    backgrounds: [
      { name: 'Saladict', value: '#5caf9e', default: true },
      { name: 'Black', value: '#000' }
    ]
  }
}

export const _Profiles = () => {
  const profiles = Array.from(Array(5)).map((_, i) => ({
    id: `profile${i + 1}`,
    name: `Profile${i + 1}`
  }))

  const profilesOption = profiles.reduce((o, p) => {
    o[p.name] = p.id
    return o
  }, {})
  return (
    <Profiles
      t={i18next.getFixedT(i18next.language, ['content', 'common'])}
      profiles={profiles}
      activeProfileId={select('Active Profile', profilesOption, profiles[0].id)}
      onHeightChanged={action('Height Changed')}
      onSelectProfile={action('Profile Selected')}
    />
  )
}
