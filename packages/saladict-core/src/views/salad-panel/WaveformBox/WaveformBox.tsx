import { useDictStore } from '@P/saladict-core/src/store'
import { SALADICT_EXTERNAL } from '@P/saladict-core/src/core/saladict-state'
import type { FC } from 'react'
import { useEffect } from 'react'

export interface WaveformBoxProps {
  darkMode: boolean
  isExpand: boolean
  toggleExpand: () => void
  onHeightChanged: (height: number) => void
}

export const WaveformBox: FC = () => {
  const props:WaveformBoxProps = useDictStore(store => {
    return {
      darkMode: store.config.darkMode,
      isExpand: store.isExpandWaveformBox,
      toggleExpand: () => {
        // store()
      },
      onHeightChanged: (height) => {
        console.log('⚡️ line:24 ~ height: ', height)
      },
    }
  })

  useEffect(() => {
    props.onHeightChanged((props.isExpand ? 165 : 0) + 12)
  }, [props])

  return (
    <div
      className={`waveformBox ${SALADICT_EXTERNAL}${
        props.isExpand ? ' isExpand' : ''
      }`}
    >
      <button className="waveformBox-DrawerBtn" onClick={props.toggleExpand}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 59.414 59.414"
          xmlns="http://www.w3.org/2000/svg"
          className="waveformBox-DrawerBtn_Arrow"
        >
          <path d="M 58 45.269 L 29.707 16.975 L 1.414 45.27 L 0 43.855 L 29.707 14.145 L 59.414 43.855" />
        </svg>
      </button>
      <div className="waveformBox-FrameWrap">
        <iframe
          className="waveformBox-Frame"
          src={''}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  )
}
