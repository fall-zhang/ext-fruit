import type { Observable } from 'rxjs'
import { EMPTY, fromEvent, merge, timer } from 'rxjs'
import {
  withLatestFrom,
  filter,
  map,
  debounce,
  switchMap,
  scan,
  startWith,
  throttle,
  delay,
  distinctUntilChanged
} from 'rxjs/operators'


import {
  getTextFromSelection,
  getSentenceFromSelection
} from 'get-selection-more'
import { isTypeField } from './helper'
import { useCallback, useEffect, type MouseEvent } from 'react'
import { isFirefox } from '../browser'
import { isTagName } from '../dom'
import type { AppConfig } from '../../app-config'
import { isInDictPanel, isInSaladictExternal } from '../../core/saladict-state'
import { checkSupportedLangs } from '../lang-check'

export function createSelectTextStream (config: AppConfig | null) {
  if (!config) {
    return EMPTY
  }

  return config.touchMode ? withTouchMode(config) : withoutTouchMode(config)
}

function withTouchMode (config: AppConfig) {
  const mousedown$ = merge(
    fromEvent<MouseEvent>(window, 'mousedown', { capture: true }).pipe(
      filter(e => e.button === 0)
    ),
    fromEvent<TouchEvent>(window, 'touchstart', { capture: true }).pipe(
      map(e => e.changedTouches[0])
    )
  )

  const mouseup$ = merge(
    fromEvent<MouseEvent>(window, 'mouseup', { capture: true }).pipe(
      filter(e => e.button === 0)
    ),
    fromEvent<TouchEvent>(window, 'touchend', { capture: true }).pipe(
      map(e => e.changedTouches[0])
    )
  )

  const clickPeriodCount$ = clickPeriodCountStream(
    mouseup$,
    config.doubleClickDelay
  )

  const isMouseDown$ = merge(
    map(() => true)(mousedown$),
    map(() => false)(mouseup$),
    map(() => false)(fromEvent(window, 'mouseout', { capture: true })),
    map(() => false)(fromEvent(window, 'blur', { capture: true }))
  )

  return fromEvent(document, 'selectionchange').pipe(
    withLatestFrom(isMouseDown$),
    debounce(([, isWithMouse]) => (isWithMouse ? mouseup$ : timer(400))),
    map(([, isWithMouse]) => [window.getSelection(), isWithMouse] as const),
    filter(
      (args): args is [Selection, boolean] =>
        !!args[0] && !isInSaladictExternal(args[0].anchorNode)
    ),
    withLatestFrom(mouseup$, mousedown$, clickPeriodCount$),
    map(([[selection, isWithMouse], mouseup, mousedown, clickPeriodCount]) => {
      const self = isInDictPanel(selection.anchorNode || mousedown.target)

      if (
        config.noTypeField &&
        isTypeField(isWithMouse ? mousedown.target : selection.anchorNode)
      ) {
        return { self }
      }

      const text = getTextFromSelection(selection)

      if (!checkSupportedLangs(config.language, text)) {
        return { self }
      }

      if (isWithMouse) {
        return {
          word: {
            text,
            context: getSentenceFromSelection(selection),
          },
          self,
          dbClick: clickPeriodCount >= 2,
          mouseX: mouseup.clientX,
          mouseY: mouseup.clientY,
          altKey: !!mouseup.altKey,
          shiftKey: !!mouseup.shiftKey,
          ctrlKey: !!mouseup.ctrlKey,
          metaKey: !!mouseup.metaKey,
        }
      }

      if (selection.rangeCount <= 0) {
        return { self }
      }

      const rect = selection.getRangeAt(0).getBoundingClientRect()

      if (
        rect.top === 0 &&
        rect.left === 0 &&
        rect.width === 0 &&
        rect.height === 0
      ) {
        // Selection is made inside textarea with keyboard. Ignore.
        return { self }
      }

      return {
        word: {
          text,
          context: getSentenceFromSelection(selection),
        },
        self,
        dbClick: clickPeriodCount >= 2,
        mouseX: rect.right,
        mouseY: rect.top,
      }
    }),
    throttle(result => {
      // Firefox will fire an extra selectionchange event
      // when selection is made inside dict panel and
      // continue search is triggered.
      // Need to skip this event otherwise the panel is
      // closed unexpectedly.
      if (isFirefox && result.self && result.word && result.word.text) {
        const { direct, double, holding } = config.panelMode
        if (
          direct ||
          (double && result.dbClick) ||
          (holding.alt && result.altKey) ||
          (holding.shift && result.shiftKey) ||
          (holding.ctrl && result.ctrlKey) ||
          (holding.meta && result.metaKey)
        ) {
          return timer(500)
        }
      }
      return timer(0)
    })
  )
}

function withoutTouchMode (config: AppConfig) {
  const mousedown$ = fromEvent<MouseEvent>(window, 'mousedown', {
    capture: true,
  }).pipe(filter(e => e.button === 0))

  const mouseup$ = fromEvent<MouseEvent>(window, 'mouseup', {
    capture: true,
  }).pipe(filter(e => e.button === 0))

  const clickPeriodCount$ = clickPeriodCountStream(
    mouseup$,
    config.doubleClickDelay
  )

  return mouseup$.pipe(
    filter(e => !isInSaladictExternal(e.target)),
    // if user click on a selected text,
    // getSelection would reture the text before the highlight disappears
    // delay to wait for selection get cleared
    delay(10),
    withLatestFrom(mousedown$, clickPeriodCount$),
    // handle in-panel search separately
    // due to tricky shadow dom event retarget
    filter(
      ([mouseup, mousedown]) =>
        !isInDictPanel(mouseup.target) && !isInDictPanel(mousedown.target)
    ),
    map(([mouseup, mousedown, clickPeriodCount]) => {
      if (config.noTypeField && isTypeField(mousedown.target)) {
        return { self: false }
      }

      const selection = window.getSelection()
      const text = getTextFromSelection(selection)

      if (!checkSupportedLangs(config.language, text)) {
        return { self: false }
      }

      return {
        word: {
          text,
          context: getSentenceFromSelection(selection),
        },
        self: false,
        dbClick: clickPeriodCount >= 2,
        mouseX: mouseup.clientX,
        mouseY: mouseup.clientY,
        altKey: mouseup.altKey,
        shiftKey: mouseup.shiftKey,
        ctrlKey: mouseup.ctrlKey,
        metaKey: mouseup.metaKey,
      }
    }),
    distinctUntilChanged((oldVal, newVal) => {
      // (Ignore this rule if it is a double click.)
      // Same selection. This could be caused by other widget on the page
      // that uses preventDefault which stops selection being cleared when clicked.
      // Ignore it so that the panel won't follow.
      return (
        !newVal.dbClick &&
        !!oldVal.word &&
        !!newVal.word &&
        oldVal.word.text === newVal.word.text &&
        oldVal.word.context === newVal.word.context
      )
    })
  )
}

export function useInPanelSelect (
  touchMode: AppConfig['touchMode'],
  language: AppConfig['language']
) {
  const onMouseUp = useCallback((ev:MouseEvent) => {
    let isPureTextNode = true
    if (touchMode) {
      isPureTextNode = false
    }

    for (
      let el = ev.target as HTMLElement | null;
      el;
      el = el.parentElement
    ) {
      if (isTagName(el, 'a') || isTagName(el, 'button')) {
        isPureTextNode = false
      }
    }
    const selection = window.getSelection()
    const text = getTextFromSelection(selection)

    return checkSupportedLangs(language, text)
      ? {
        word: {
          text,
          context: getSentenceFromSelection(selection),
        },
        mouseX: ev.clientX,
        mouseY: ev.clientY,
        altKey: ev.altKey,
        shiftKey: ev.shiftKey,
        ctrlKey: ev.ctrlKey,
        metaKey: ev.metaKey,
        self: true,
        instant: false,
        force: false,
      }
      : {
        word: null,
        self: true,
        mouseX: 0,
        mouseY: 0,
        dbClick: false,
        altKey: false,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
        instant: false,
        force: false,
      }
  }, [])
  return onMouseUp
}

function clickPeriodCountStream (
  mouseup$: Observable<MouseEvent | Touch | React.MouseEvent>,
  doubleClickDelay: number
) {
  return mouseup$.pipe(
    switchMap(() =>
      timer(doubleClickDelay).pipe(map(() => false), startWith(true))
    ),
    scan((sum: number, flag: boolean) => (flag ? sum + 1 : 0), 0)
  )
}
