import type { AppConfig } from '@/config/app-config'
import { checkSupportedLangs } from '@/core/api-server/utils/lang-check'
import { isTagName } from '@/utils/dom'
import { getTextFromSelection, getSentenceFromSelection } from '@/utils/get-selection-more'
import { useCallback } from 'react'

export function useInPanelSelect (
  touchMode: AppConfig['touchMode'],
  language: AppConfig['language']
) {
  const onMouseUp = useCallback((ev: MouseEvent) => {
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
