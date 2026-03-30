import { SALADICT_PANEL } from '@/config/const/saladict'

/**
 * Is element in Saladict Dict Panel
 * @description 当前 element 是否在 Salad Panel 中
 */
export function isInDictPanel (element: Node | EventTarget | null): boolean {
  if (!element) {
    return false
  }

  for (let el: Element | null = element as Element; el; el = el.parentElement) {
    if (el.classList && el.classList.contains(SALADICT_PANEL)) {
      return true
    }
  }

  return false
}
