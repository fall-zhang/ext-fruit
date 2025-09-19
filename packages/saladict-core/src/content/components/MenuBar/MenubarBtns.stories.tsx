import React from 'react'
import i18next from 'i18next'
import { action } from '@storybook/addon-actions'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import { withi18nNS, withSaladictPanel } from '@/_helpers/storybook'
import {
  HistoryBackBtn,
  HistoryNextBtn,
  SearchBtn,
  OptionsBtn,
  FavBtn,
  HistoryBtn,
  NotebookBtn,
  PinBtn,
  FocusBtn,
  CloseBtn,
  SidebarBtn
} from './MenubarBtns'
import { useTranslate } from '@/_helpers/i18n'
import menubarBtnsStyle from './MenubarBtns.scss?raw'
export default {
  title: 'Content Scripts|Dict Panel/Menubar',

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    (story) => <BtnsParent story={story} />,
    withSaladictPanel({
      head: <style>{menubarBtnsStyle}</style>,
      backgroundColor: 'transparent'
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

export const _HistoryBackBtn = () => {
  return (
    <HistoryBackBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    />
  )
}

_HistoryBackBtn.story = {
  name: 'HistoryBackBtn'
}

export const _HistoryNextBtn = () => {
  return (
    <HistoryNextBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    />
  )
}

_HistoryNextBtn.story = {
  name: 'HistoryNextBtn'
}

export const _SearchBtn = () => {
  return (
    <SearchBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    />
  )
}

_SearchBtn.story = {
  name: 'SearchBtn'
}

export const _OptionsBtn = () => {
  return (
    <OptionsBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
      onKeyDown={action('onKeyDown')}
      onMouseOver={action('onMouseOver')}
      onMouseOut={action('onMouseOut')}
    />
  )
}

_OptionsBtn.story = {
  name: 'OptionsBtn'
}

export const _FavBtn = () => {
  return (
    <FavBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      isFav={boolean('Is in Notebook', true)}
      onClick={action('onClick')}
      onMouseDown={action('onMouseDown')}
    />
  )
}

_FavBtn.story = {
  name: 'FavBtn'
}

export const _HistoryBtn = () => {
  return (
    <HistoryBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    />
  )
}

_HistoryBtn.story = {
  name: 'HistoryBtn'
}

export const _NotebookBtn = () => {
  return (
    <NotebookBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    />
  )
}

_NotebookBtn.story = {
  name: 'NotebookBtn'
}

export const _PinBtn = () => {
  return (
    <PinBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      isPinned={boolean('Is pinned', false)}
      onClick={action('onClick')}
    />
  )
}

_PinBtn.story = {
  name: 'PinBtn'
}

export const _FocusBtn = () => {
  return (
    <FocusBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      isFocus={boolean('Is pinned', false)}
      onClick={action('onClick')}
    />
  )
}

_FocusBtn.story = {
  name: 'FocusBtn'
}

export const _CloseBtn = () => {
  return (
    <CloseBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    />
  )
}

_CloseBtn.story = {
  name: 'CloseBtn'
}

export const _SidebarBtn = () => {
  return (
    <SidebarBtn
      t={i18next.getFixedT(i18next.language, 'content')}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    />
  )
}

_SidebarBtn.story = {
  name: 'SidebarBtn'
}

function BtnsParent (props: { story: any }) {
  const { t } = useTranslate('content')
  return <>{props.story(t)}</>
}
