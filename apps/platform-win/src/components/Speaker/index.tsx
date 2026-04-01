import type {
  FC,
  ComponentProps,
  ReactNode
} from 'react'
import React, {
  useCallback,
  useState,
  useContext
} from 'react'
import { useUpdateEffect } from 'react-use'
import { timer } from '../../utils/promise-more'
import { isTagName } from '../../utils/dom'
import { Volume2Icon } from 'lucide-react'

type SpeakerType = {
  onPlayStart: (src: string) => Promise<void>
  isPlaying?: boolean
  playingSrc?: string

}
/** onPlayStart */
const StaticSpeakerContext = React.createContext<SpeakerType>({
  onPlayStart (src: string) {
    throw new Error('Function not implemented.')
  },
  playingSrc: '',
  isPlaying: false,
})

export interface SpeakerProps {
  /** render nothing when no src */
  readonly src?: string | (() => Promise<string>)
  /** @default 1.2em */
  readonly width?: number | string
  /** @default 1.2em */
  readonly height?: number | string
}

/**
 * Speaker for playing audio files
 * 用于播放音频文件
 */
export const Speaker: FC<SpeakerProps> = props => {
  const { onPlayStart, isPlaying, playingSrc } = useContext(StaticSpeakerContext)
  if (!props.src) return null

  let renderSrc
  if (typeof props.src === 'function') {
    renderSrc = '#'
  } else {
    renderSrc = props.src
  }

  const width = props.width || props.height || '1.2em'
  const height = props.height || width

  return (
    <a
      className="saladict-Speaker"
      href={renderSrc}
      target="_blank"
      rel="noopener noreferrer"
      style={{ width, height }}
      onClick={async e => {
        if (typeof props.src === 'function') {
          e.stopPropagation()
          e.preventDefault()
          const result = await props.src()
          onPlayStart(result)
          return
        }
        onPlayStart(renderSrc)
      }}
    >
      {/* <Speak */}
      <Volume2Icon />
    </a>
  )
}

export default React.memo(Speaker)

export type SpeakerProviderProps = SpeakerType & {
  children: ReactNode
}

/**
 * Listens to HTML injected Speakers in childern
 */
export const SpeakerProvider: FC<SpeakerProviderProps> = ({ children, ...props }) => {
  return (
    <StaticSpeakerContext.Provider value={props}>
      {children}
      {/* <div onClick={onClick} {...restProps} /> */}
    </StaticSpeakerContext.Provider>
  )
}

/**
 * Returns a anchor element
 */
export const getStaticSpeaker = (src?: string | null) => {
  if (!src) {
    return ''
  }

  const $a = document.createElement('a')
  $a.target = '_blank'
  $a.href = src
  $a.className = 'saladict-Speaker'
  return $a
}

/**
 * Returns an anchor element string
 */
export const getStaticSpeakerString = (src?: string | null) =>
  (src
    ? `<a href="${src}" target="_blank" rel="noopener noreferrer" class="saladict-Speaker"></a>`
    : '')
