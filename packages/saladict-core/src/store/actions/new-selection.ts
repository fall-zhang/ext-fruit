import type { GlobalState } from '../global-state'
import type { Writable } from 'type-fest'
import { newWord } from '../../dict-utils/new-word'
import type { Word } from '../../types/word'

export const newSelection = (state:GlobalState, selection:{
  word: Word
  mouseX: number
  mouseY: number
  dbClick: boolean
  altKey: boolean
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  /** inside panel? */
  self: boolean
  /** skip salad bowl and show panel directly */
  instant: boolean
  /** force panel to skip reconciling position */
  force: boolean
}) => {
  // Skip selection inside panel
  if (selection.self) return state

  const { config } = state

  const newState: Writable<typeof state> = {
    ...state,
    selection: {
      ...selection,
      word: newWord(selection.word),
    },
  }

  if (selection.word) {
    if (selection.force) {
      newState.dictPanelCoord = {
        x: selection.mouseX,
        y: selection.mouseY,
      }
    } else if (!state.isPinned) {
      // icon position       10px  panel position
      //           +-------+      +------------------------+
      //           |       |      |                        |
      //           |       | 30px |                        |
      //      50px +-------+      |                        |
      //           |  30px        |                        |
      //     20px  |              |                        |
      //     +-----+              |                        |
      // cursor
      const iconWidth = 30
      const scrollbarWidth = 10

      newState.bowlCoord = {
        x: selection.mouseX + config.bowlOffsetX,
        y: selection.mouseY + config.bowlOffsetY,
      }

      if (newState.bowlCoord.x < 30) {
        newState.bowlCoord.x = 30
      } else if (
        newState.bowlCoord.x + iconWidth + 30 + scrollbarWidth >
        window.innerWidth
      ) {
        newState.bowlCoord.x =
          window.innerWidth - iconWidth - scrollbarWidth - 30
      }

      if (newState.bowlCoord.y < 30) {
        newState.bowlCoord.y = 30
      } else if (newState.bowlCoord.y + iconWidth + 30 > window.innerHeight) {
        newState.bowlCoord.y = window.innerHeight - iconWidth - 30
      }

      newState.dictPanelCoord = {
        x: newState.bowlCoord.x + iconWidth + 10,
        y: newState.bowlCoord.y,
      }

      if (
        newState.dictPanelCoord.x + newState.config.panelWidth + 20 >
        window.innerWidth
      ) {
        // right overflow
        newState.dictPanelCoord.x =
          newState.bowlCoord.x - 10 - newState.config.panelWidth
      }
    }
  }

  if ((state.withQssaPanel && config.qssaPageSel)) {
    return newState
  }

  const isActive = config.active && !state.isTempDisabled

  const { direct, holding, double } = config.mode


  newState.isShowBowl = Boolean(
    isActive &&
      selection.word &&
      selection.word.text &&
      !direct &&
      !(double && selection.dbClick) &&
      !(holding.alt && selection.altKey) &&
      !(holding.shift && selection.shiftKey) &&
      !(holding.ctrl && selection.ctrlKey) &&
      !(holding.meta && selection.metaKey) &&
      !selection.instant
  )

  return newState
}

export default newSelection
