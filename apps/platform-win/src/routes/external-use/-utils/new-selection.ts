import { newWord } from '@/utils/dict-utils/new-word'
import type { Word } from '@/types/word'

export const newSelection = (selection: {
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
}, config: {
  bowlOffsetX: number
  bowlOffsetY: number
  direct: boolean
  holding: boolean
  double: boolean
}) => {
  // Skip selection inside panel
  const newState = {
    isShowBowl: false,
    dictPanelCoord: {
      x: 0,
      y: 0,
    },
    bowlCoord: {
      x: 0,
      y: 0,
    },
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
    } else {
      // icon position       10px  panel position
      //           +-------+      +------------------------+
      //           | icon  |      |                        |
      //           |       | 30px |                        |
      //      50px +-------+      |                        |
      //           |  30px        |                        |
      //     20px  |              |                        |
      //   → +-----+              |                        |
      // cursor 鼠标位置
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
        newState.dictPanelCoord.x + 280 + 20 >
        window.innerWidth
      ) {
        // right overflow
        newState.dictPanelCoord.x =
          newState.bowlCoord.x - 10 - 280
      }
    }
  }

  const { direct, holding, double } = config


  newState.isShowBowl = Boolean(
    selection.word &&
      selection.word.text &&
      !direct &&
      !(double && selection.dbClick) &&
      !(holding && selection.altKey) &&
      !selection.instant
  )

  return newState
}

export default newSelection
