import type { FloatBoxProps } from '@P/saladict-core/src/components/FloatBox'
import type { FC } from 'react'

export interface SuggestItem {
  explain: string
  entry: string
}

export type SuggestProps = {
  /** Search box text */
  text: string
} & Pick<
  FloatBoxProps,
  'onFocus' |
  'onBlur' |
  'onSelect' |
  'onArrowUpFirst' |
  'onClose' |
  'onHeightChanged'
>

/**
 * Suggest panel offering similar words.
 */
export const SuggestWord: FC<SuggestProps> = (props) => {
  return <>
    <span className="menuBar-SuggestsEntry" style={{}}>
      {props.word}
    </span>
    <span className="menuBar-SuggestsExplain">
      {props.explain}
    </span>
  </>
}
