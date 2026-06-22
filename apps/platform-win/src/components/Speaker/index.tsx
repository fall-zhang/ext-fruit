import type {
  FC,
  ReactNode
} from 'react'
import React, {
  useContext
} from 'react'
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

  return (
    <div
      className="saladict-Speaker dark:text-neutral-300 text-neutral-800 cursor-pointer"
      // href={renderSrc}
      // target="_blank"
      // rel="noopener noreferrer"
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
      <Volume2Icon className='text-neutral-700 dark:text-neutral-300' />
    </div>
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
 * Returns an anchor element string
 */
export const getStaticSpeakerString = (src?: string | null) =>
  (src
    ? `<a href="${src}" target="_blank" rel="noopener noreferrer" class="saladict-Speaker"></a>`
    : '')
