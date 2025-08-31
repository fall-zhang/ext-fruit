import { useCallback, useEffect, useMemo, useState } from 'react'
export type KeyModifier = 'Alt' | 'AltGraph' | 'CapsLock' | 'Control' | 'Fn' | 'FnLock' | 'Meta' | 'NumLock' | 'ScrollLock' | 'Shift' | 'Symbol' | 'SymbolLock'
export type KeyMap = 'alt' | 'capsLock' | 'control' | 'fn' | 'meta' | 'fnLock' | 'meta' | 'numLock' | 'shift'
export const useKeyModifier = () => {
  const [keys, setKeys] = useState<Record<KeyMap, boolean>>({
    alt: false,
    capsLock: false,
    shift: false,
    control: false,
    fn: false,
    meta: false,
    fnLock: false,
    numLock: false
  })

  useEffect(() => {
    const keyDown = (ev:KeyboardEvent) => {
      const state = {
        control: ev.ctrlKey,
        alt: ev.altKey,
        shift: ev.shiftKey,
        meta: ev.metaKey,
        capsLock: ev.getModifierState('CapsLock'),
        fn: ev.getModifierState('Fn'),
        fnLock: ev.getModifierState('FnLock'),
        numLock: ev.getModifierState('NumLock')
      }
      setKeys(state)
    }
    function keyUp (ev:KeyboardEvent) {
      const state = {
        control: ev.ctrlKey,
        alt: ev.altKey,
        shift: ev.shiftKey,
        meta: ev.metaKey,
        capsLock: ev.getModifierState('CapsLock'),
        fn: ev.getModifierState('Fn'),
        fnLock: ev.getModifierState('FnLock'),
        numLock: ev.getModifierState('NumLock')
      }
      setKeys(state)
    }
    document.addEventListener('keydown', keyDown)
    document.addEventListener('keyup', keyUp)
    return () => {
      document.removeEventListener('keydown', keyDown)
      document.removeEventListener('keyup', keyUp)
    }
  })
  return keys
}
