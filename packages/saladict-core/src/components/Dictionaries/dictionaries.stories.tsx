import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { action } from '@storybook/addon-actions'
import { withKnobs, select, number, boolean } from '@storybook/addon-knobs'
import {
  withSaladictPanel,
  withSideEffect,
  mockRuntimeMessage,
  withi18nNS
} from '@/_helpers/storybook'
import { DictItem } from '../../saladict-core/src/content/components/DictItem/DictItem'
import { getDefaultConfig, DictID } from '@/app-config'
import { getDefaultProfile } from '@/app-config/profiles'
import { SearchFunction, MockRequest } from './helpers'
import { getAllDicts } from '@/app-config/dicts'
import { useTranslate } from '@/_helpers/i18n'
import { timer } from '@/_helpers/promise-more'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Salad/Dictionary',
  component: DictItem,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {

  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { }
} satisfies Meta<typeof DictItem>

export default meta
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    dictID: 'sogou',
    catalog: [],
    darkMode: false,
    withAnimation: true,
    panelCSS: '',
    preferredHeight: number('Preferred Height', 256),
    searchStatus: 'IDLE',
    searchResult: {
      requireCredential: true,
      id: 'sogou',
      sl: 'auto',
      tl: 'auto',
      slInitial: 'hide',
      searchText: { paragraphs: [''] },
      trans: { paragraphs: [''] }
    },
    searchText: action('Search Text'),
    openDictSrcPage: action('Open Dict Source Page'),
    onHeightChanged: action('Height Changed'),
    onUserFold: action('User Fold'),
    onSpeakerPlay: (src) => {
      action('Speaker Play')(src)
      return Promise.resolve()
    },
    onInPanelSelect: () => action('Inpanel Select')()
  }
}


// const stories = storiesOf('Content Scripts|Dictionaries', module)
//   .addParameters({
//     backgrounds: [
//       { name: 'Saladict', value: '#5caf9e', default: true },
//       { name: 'Black', value: '#000' }
//     ]
//   })
//   .addDecorator(
//     withSideEffect(
//       mockRuntimeMessage(async (message) => {
//         if (message.type === 'DICT_ENGINE_METHOD') {
//           action('Calling DICT_ENGINE_METHOD')(message.payload)
//           await timer(Math.random() * 2000) 00
//             '@/components/Dictionaries/' + message.payload.id + '/engine.ts'
//           )[message.payload.method]
//           return method(...(message.payload.args || []))
//         }
//         action(message.type)(message.payload)
//       })
//     )
//   )
//   .addDecorator(
//     withSaladictPanel({
//       head: (
//         <style>
//           {require('@/content/components/DictItem/DictItem.scss').toString()}
//         </style>
//       ),
//       height: 'auto'
//     })
//   )
//   .addDecorator(withi18nNS(['content', 'dicts']))
//   .addDecorator(withKnobs)

// Object.keys(getAllDicts())
//   .filter(
//     // opentranslate
//     (id) =>
//       id !== 'baidu' &&
//       id !== 'caiyun' &&
//       id !== 'google' &&
//       id !== 'sogou' &&
//       id !== 'tencent' &&
//       id !== 'youdaotrans'
//   )
//   .forEach((id) => {
//     stories.add(id, ({ fontSize, withAnimation, darkMode }) => (
//       <Dict
//         key={id}
//         dictID={id as DictID}
//         fontSize={fontSize}
//         darkMode={darkMode}
//         withAnimation={withAnimation}
//       />
//     ))
//   })

// function Dict (props: {
//   dictID: DictID;
//   fontSize: number;
//   darkMode: boolean;
//   withAnimation: boolean;
// }) {
//   const { i18n } = useTranslate()

//   const { mockSearchTexts, mockRequest } = require(
//     '../../../test/specs/components/dictionaries/' +
//       props.dictID +
//       '/requests.mock.ts'
//   ) as {
//     mockSearchTexts: string[];
//     mockRequest: MockRequest;
//   }

//   const localesModule = require(
//     '@/components/Dictionaries/' + props.dictID + '/_locales'
//   )

//   const locales = localesModule.locales || localesModule

//   const { search } = require(
//     '@/components/Dictionaries/' + props.dictID + '/engine.ts'
//   ) as { search: SearchFunction<any> }

//   const searchText =
//     mockSearchTexts.length > 1
//       ? select(
//         'Search Text',
//         mockSearchTexts.reduce((o, t) => {
//           o[t] = t
//           return o
//         }, {}),
//         mockSearchTexts[0]
//       )
//       : mockSearchTexts[0]

//   const [status, setStatus] = useState<'IDLE' | 'SEARCHING' | 'FINISH'>('IDLE')
//   const [result, setResult] = useState<any>(null)
//   const [catalog, setCatalog] = useState<any>()

//   const [profiles, updateProfiles] = useState(() => getDefaultProfile())
//   // custom dict options
//   const options = profiles.dicts.all[props.dictID].options
//   const optKeys = options ? Object.keys(options) : []
//   const optValues = optKeys.map((key) => {
//     const name = locales.options[key][i18n.language]
//     switch (typeof options[key]) {
//     case 'boolean':
//       return boolean(name, options[key])
//     case 'number':
//       return number(name, options[key])
//     case 'string': {
//       const values: string[] =
//           profiles.dicts.all[props.dictID].optionsSel[key]
//       return select(
//         name,
//         values.reduce((o, k) => {
//           o[locales.options[`${key}-${k}`][i18n.language]] = k
//           return o
//         }, {}),
//         options[key]
//       )
//     }
//     default:
//       return options[key]
//     }
//   })

//   useEffect(() => {
//     const newProfiles = getDefaultProfile()
//     const newOptions = newProfiles.dicts.all[props.dictID].options
//     optKeys.forEach((key, i) => {
//       newOptions[key] = optValues[i]
//     })
//     updateProfiles(newProfiles)
//   }, optValues)

//   useEffect(() => {
//     // mock requests
//     const mock = new AxiosMockAdapter(axios)
//     mockRequest(mock)
//     mock.onAny().reply((config) => {
//       console.warn(`Unmatch url: ${config.url}`, config)
//       return [404, {}]
//     })
//     return () => mock.restore()
//   }, [])

//   useEffect(() => {
//     setStatus('SEARCHING')
//     search(searchText, getDefaultConfig(), profiles, {
//       isPDF: false
//     }).then(async ({ result, catalog }) => {
//       setStatus('FINISH')
//       setResult(result)
//       setCatalog(catalog)
//     })
//   }, [searchText, profiles])

//   return (
//     <DictItem
//       dictID={props.dictID}
//       catalog={catalog}
//       darkMode={props.darkMode}
//       withAnimation={props.withAnimation}
//       panelCSS={''}
//       preferredHeight={number('Preferred Height', 256)}
//       searchStatus={status}
//       searchResult={result}
//       searchText={action('Search Text')}
//       openDictSrcPage={action('Open Dict Source Page')}
//       onHeightChanged={action('Height Changed')}
//       onUserFold={action('User Fold')}
//       onSpeakerPlay={(src) => {
//         action('Speaker Play')(src)
//         return Promise.resolve()
//       }}
//       onInPanelSelect={() => action('Inpanel Select')()}
//     />
//   )
// }
