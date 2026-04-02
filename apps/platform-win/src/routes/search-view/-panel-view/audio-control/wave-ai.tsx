import * as React from 'react'
import classNames from 'classnames'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js'
import NumberEditor from 'react-number-editor'
import { message, storage } from '@/_helpers/browser-api'
import { isFirefox } from '@/_helpers/saladict'
import { SoundTouch, SimpleFilter, getWebAudioNode } from 'soundtouchjs'
import { ReloadIcon } from './icon/reload'
import { NoReloadIcon } from './icon/no-reload'
import { SoundIcon } from './icon/sound'

interface AnyObject {
  [index: string]: any
}

interface WaveformProps {
  darkMode: boolean
}

interface WaveformState {
  blob?: Blob
  isPlaying: boolean
  speed: number
  loop: boolean
  /** use pitch stretcher */
  pitchStretch: boolean
}

export const Waveform: React.FC<WaveformProps> = ({ darkMode }) => {
  // DOM & Instance refs
  const containerRef = React.useRef<HTMLDivElement>(null)
  const wavesurferRef = React.useRef<WaveSurfer | null>(null)
  const regionRef = React.useRef<AnyObject | null>(null)
  const soundTouchRef = React.useRef<AnyObject | null>(null)
  const soundTouchNodeRef = React.useRef<AnyObject | null>(null)

  // Mutable instance variables (don't trigger re-renders)
  const shouldSTSyncRef = React.useRef<boolean>(false)
  const playOnLoadRef = React.useRef<boolean>(true)

  // Component state
  const [state, setState] = React.useState<WaveformState>({
    isPlaying: false,
    speed: 1,
    loop: false,
    pitchStretch: true,
  })

  // Ref to hold latest callbacks for wavesurfer event handlers (avoid stale closures)
  const callbacksRef = React.useRef({
    play: null as (() => void) | null,
    pause: null as (() => void) | null,
    onPlayEnd: null as (() => void) | null,
    onLoad: null as (() => void) | null,
    isInRegion: null as ((region?: AnyObject | null) => boolean) | null,
    removeRegion: null as (() => void) | null,
    updateSpeed: null as ((speed: number) => void) | null,
    updatePitchStretch: null as ((flag: boolean) => void) | null,
  })

  // ─────────────────────────────────────────────────────────────
  // Core utility functions
  // ─────────────────────────────────────────────────────────────

  const removeRegion = React.useCallback(() => {
    if (regionRef.current) {
      regionRef.current.remove()
    }
    regionRef.current = null
  }, [])

  const isInRegion = React.useCallback((region: AnyObject | null = regionRef.current): boolean => {
    if (region && wavesurferRef.current) {
      const curTime = wavesurferRef.current.getCurrentTime()
      return curTime >= region.start && curTime <= region.end
    }
    return false
  }, [])

  const initSoundTouch = React.useCallback((wavesurfer: WaveSurfer) => {
    const buffer = wavesurfer.backend.buffer
    const bufferLength = buffer.length
    const lChannel = buffer.getChannelData(0)
    const rChannel = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : lChannel
    let seekingDiff = 0

    const source = {
      extract: (target: Float32Array, numFrames: number, position: number) => {
        if (shouldSTSyncRef.current) {
          seekingDiff = ~~(wavesurfer.backend.getPlayedPercents() * bufferLength) - position
          shouldSTSyncRef.current = false
        }
        position += seekingDiff
        for (let i = 0; i < numFrames; i++) {
          target[i * 2] = lChannel[i + position]
          target[i * 2 + 1] = rChannel[i + position]
        }
        return Math.min(numFrames, bufferLength - position)
      },
    }

    soundTouchRef.current = new SoundTouch(wavesurfer.backend.ac.sampleRate)
    soundTouchNodeRef.current = getWebAudioNode(
      wavesurfer.backend.ac,
      new SimpleFilter(source, soundTouchRef.current)
    )
    wavesurfer.backend.setFilter(soundTouchNodeRef.current)
  }, [])

  // ─────────────────────────────────────────────────────────────
  // Playback control functions
  // ─────────────────────────────────────────────────────────────

  const pause = React.useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }))
    if (soundTouchNodeRef.current) {
      soundTouchNodeRef.current.disconnect()
    }
    if (wavesurferRef.current) {
      wavesurferRef.current.pause()
      wavesurferRef.current.backend.disconnectFilters()
    }
  }, [])

  const play = React.useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }))
    if (wavesurferRef.current) {
      if (
        state.pitchStretch &&
        soundTouchNodeRef.current &&
        wavesurferRef.current.getFilters().length <= 0
      ) {
        wavesurferRef.current.backend.setFilter(soundTouchNodeRef.current)
      }
      if (regionRef.current && !isInRegion()) {
        wavesurferRef.current.play(regionRef.current.start)
      } else {
        wavesurferRef.current.play()
      }
    }
    shouldSTSyncRef.current = true
  }, [state.pitchStretch, isInRegion])

  const onPlayEnd = React.useCallback(() => {
    state.loop ? play() : pause()
  }, [state.loop, play, pause])

  const onLoad = React.useCallback(() => {
    if (playOnLoadRef.current) {
      play()
    }
    playOnLoadRef.current = true
  }, [play])

  // ─────────────────────────────────────────────────────────────
  // Settings update functions
  // ─────────────────────────────────────────────────────────────

  const updateSpeed = React.useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }))
    if (speed < 0.1 || speed > 3) return

    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(speed)
      if (speed !== 1 && state.pitchStretch && !soundTouchRef.current) {
        initSoundTouch(wavesurferRef.current)
      }
      if (soundTouchRef.current) {
        soundTouchRef.current.tempo = speed
      }
    }
    shouldSTSyncRef.current = true
  }, [state.pitchStretch, initSoundTouch])

  const updatePitchStretch = React.useCallback((flag: boolean) => {
    setState(prev => ({ ...prev, pitchStretch: flag }))
    if (flag) {
      if (
        state.speed !== 1 &&
        soundTouchNodeRef.current &&
        wavesurferRef.current &&
        wavesurferRef.current.getFilters().length <= 0
      ) {
        wavesurferRef.current.backend.setFilter(soundTouchNodeRef.current)
        shouldSTSyncRef.current = true
      }
    } else {
      if (soundTouchNodeRef.current) {
        soundTouchNodeRef.current.disconnect()
      }
      if (wavesurferRef.current) {
        wavesurferRef.current.backend.disconnectFilters()
      }
    }
  }, [state.speed])

  // ─────────────────────────────────────────────────────────────
  // Reset & Load functions
  // ─────────────────────────────────────────────────────────────

  const reset = React.useCallback(() => {
    removeRegion()
    updateSpeed(1)
    if (wavesurferRef.current) {
      wavesurferRef.current.pause()
      wavesurferRef.current.empty()
      wavesurferRef.current.backend.disconnectFilters()
    }
    if (soundTouchRef.current) {
      soundTouchRef.current.clear()
      soundTouchRef.current.tempo = 1
    }
    if (soundTouchNodeRef.current) {
      soundTouchNodeRef.current.disconnect()
    }
    soundTouchRef.current = null
    soundTouchNodeRef.current = null
    shouldSTSyncRef.current = false
  }, [removeRegion, updateSpeed])

  const initWavesurfer = React.useCallback(() => {
    if (!containerRef.current || wavesurferRef.current) return

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#f9690e',
      progressColor: '#B71C0C',
      plugins: [RegionsPlugin.create()],
    })

    wavesurferRef.current = wavesurfer
    wavesurfer.enableDragSelection({})

    wavesurfer.on('region-created', (region: AnyObject) => {
      removeRegion()
      regionRef.current = region
    })
    wavesurfer.on('region-update-end', () => callbacksRef.current.play?.())
    wavesurfer.on('region-out', () => callbacksRef.current.onPlayEnd?.())
    wavesurfer.on('seek', () => {
      if (!callbacksRef.current.isInRegion?.()) {
        removeRegion()
      }
      shouldSTSyncRef.current = true
    })
    wavesurfer.on('ready', () => callbacksRef.current.onLoad?.())
    wavesurfer.on('finish', () => callbacksRef.current.onPlayEnd?.())
  }, [removeRegion])

  const load = React.useCallback((src: string) => {
    if (src) {
      if (wavesurferRef.current) {
        reset()
      } else {
        initWavesurfer()
      }
      if (wavesurferRef.current) {
        wavesurferRef.current.load(src)
        if (
          wavesurferRef.current.backend.ac.state === 'suspended' &&
          playOnLoadRef.current
        ) {
          new Audio(src).play()
        }
      }
    } else {
      reset()
    }
  }, [reset, initWavesurfer])

  // ─────────────────────────────────────────────────────────────
  // UI Event Handlers
  // ─────────────────────────────────────────────────────────────

  const togglePlay = React.useCallback(() => {
    state.isPlaying ? pause() : play()
  }, [state.isPlaying, pause, play])

  const toggleLoop = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked
    setState(prev => ({ ...prev, loop: checked }))
    if (checked && !state.isPlaying) {
      play()
    }
  }, [state.isPlaying, play])

  const togglePitchStretch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked
    updatePitchStretch(checked)
    storage.local.set({ waveform_pitch: checked })
  }, [updatePitchStretch])

  // ─────────────────────────────────────────────────────────────
  // Sync callbacks ref (for wavesurfer event handlers)
  // ─────────────────────────────────────────────────────────────

  React.useEffect(() => {
    callbacksRef.current = {
      play,
      pause,
      onPlayEnd,
      onLoad,
      isInRegion,
      removeRegion,
      updateSpeed,
      updatePitchStretch,
    }
  }, [play, pause, onPlayEnd, onLoad, isInRegion, removeRegion, updateSpeed, updatePitchStretch])

  // ─────────────────────────────────────────────────────────────
  // Lifecycle: componentDidMount
  // ─────────────────────────────────────────────────────────────

  React.useEffect(() => {
    const messageListener = message.self.addListener('PLAY_AUDIO', async ({ payload: src }: { payload: string }) => {
      load(src)
    })

    // message.self
    //   .send<'LAST_PLAY_AUDIO'>({ type: 'LAST_PLAY_AUDIO' })
    //   .then(response => {
    //     if (response?.src && response.timestamp - Date.now() < 10000) {
    //       load(response.src)
    //     } else {
    //       playOnLoadRef.current = false
    //       load('https://fanyi.sogou.com/reventondc/synthesis?text=Nothing%20to%20play&speed=1&lang=en&from=translateweb')
    //     }
    //   })

    // storage.local.get('waveform_pitch').then(({ waveform_pitch }) => {
    //   if (waveform_pitch != null) {
    //     updatePitchStretch(Boolean(waveform_pitch))
    //   }
    // })

    return () => {
      messageListener?.remove?.()
    }
  }, [load, updatePitchStretch])

  // ─────────────────────────────────────────────────────────────
  // Lifecycle: Initialize wavesurfer when container mounts
  // ─────────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (containerRef.current && !wavesurferRef.current) {
      initWavesurfer()
    }
  }, [initWavesurfer])

  // ─────────────────────────────────────────────────────────────
  // Lifecycle: componentWillUnmount
  // ─────────────────────────────────────────────────────────────

  React.useEffect(() => {
    return () => {
      reset()
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
        wavesurferRef.current = null
      }
    }
  }, [reset])

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div className={classNames({ darkMode })}>
      <div className="saladict-waveformWrap saladict-theme">
        <div ref={containerRef} />
        <div className="saladict-waveformCtrl">
          <button
            type="button"
            className="saladict-waveformPlay"
            title="Play/Pause"
            onClick={togglePlay}
          >
            <div className={`saladict-waveformPlay_FG${state.isPlaying ? ' isPlaying' : ''}`} />
          </button>
          <NumberEditor
            className="saladict-waveformSpeed"
            title="Speed"
            value={state.speed}
            min={0.1}
            max={3}
            step={0.005}
            decimals={3}
            onValueChange={updateSpeed}
          />
          <label className="saladict-waveformBtn_label" title="Loop">
            {state.loop
              ? (<ReloadIcon />)
              : (<NoReloadIcon/>)}
            <input type="checkbox" checked={state.loop} onChange={toggleLoop} />
          </label>
          {!isFirefox && (
            <label className="saladict-waveformPitch saladict-waveformBtn_label" title="Pitch Stretch">
              <SoundIcon
                fill={state.pitchStretch
                  ? 'var(--color-font)'
                  : 'var(--color-divider)'} />
              <input type="checkbox" checked={state.pitchStretch} onChange={togglePitchStretch} />
            </label>
          )}
        </div>
      </div>
    </div>
  )
}

export default Waveform
