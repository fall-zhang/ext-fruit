
export const SALADICT_EXTERNAL = 'saladict-external'

export const SALADICT_PANEL = 'saladict-panel'

/**
 * Is element in a Saladict external element
 */
export function isInSaladictExternal (
  element: Element | EventTarget | null
): boolean {
  if (!element) {
    return false
  }

  for (let el: Element | null = element as Element; el; el = el.parentElement) {
    if (el.classList && el.classList.contains(SALADICT_EXTERNAL)) {
      return true
    }
  }

  return false
}

/**
 * Is element in Saladict Dict Panel
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
