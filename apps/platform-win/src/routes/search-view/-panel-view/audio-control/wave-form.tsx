import { isFirefox } from '@/utils/browser'
import clsx from 'clsx'
import { useEffect, useRef, useState, type FC, type ChangeEvent, useEffectEvent } from 'react'
import { InputNumber as NumberEditor } from 'antd'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'
import { useDictStore } from '@/store'
import { ReloadIcon } from './icon/reload'
import { NoReloadIcon } from './icon/no-reload'
import { SoundIcon } from './icon/sound'
// import { SoundTouch, SimpleFilter, getWebAudioNode } from 'soundtouchjs'
export const WaveFormView: FC<{
  darkMode: boolean
  src: string
}> = ({ darkMode, src }) => {
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [loop, setLoop] = useState(false)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const state = useDictStore()
  useEffect(() => {
    loadAudio(src)
  }, [src])
  const loadAudio = useEffectEvent((src: string) => {
    if (src) {
      if (wavesurfer.current) {
        resetAudio()
      } else {
        initWavesurfer()
      }

      if (wavesurfer.current) {
        wavesurfer.current.load(src)
        // https://github.com/katspaugh/wavesurfer.js/issues/1657
        wavesurfer.current.play()
        // fallback
      }
    } else {
      resetAudio()
    }
  })
  const resetAudio = () => {
    removeRegion()
    onUpdateSpeed(1)
    if (wavesurfer.current) {
      wavesurfer.current.pause()
      wavesurfer.current.empty()
    }
  }
  const initWavesurfer = () => {
    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current!,
      waveColor: '#f9690e',
      progressColor: '#B71C0C',
      // 划分区域功能
      plugins: [RegionsPlugin.create()],
    })

    // wavesurfer.current.on('region-created', region => {
    //   removeRegion()
    // })
    // wavesurfer.current.on('region-update-end', this.play)
    // wavesurfer.current.on('region-out', this.onPlayEnd)
    // wavesurfer.current.on('seek', () => {
    //   if (!this.isInRegion()) {
    //     removeRegion()
    //   }
    //   this.shouldSTSync = true
    // })

    // wavesurfer.current.on('ready', this.onLoad)

    // wavesurfer.current.on('finish', this.onPlayEnd)
  }
  const removeRegion = () => {
    // if (this.region) {
    //   this.region.remove()
    // }
    // this.region = null
  }
  useEffect(() => {
    const lastPlayVideo = state.lastPlayAudio
    if (lastPlayVideo && lastPlayVideo.src && lastPlayVideo.timestamp - Date.now() < 10000) {
      loadAudio(lastPlayVideo.src)
    } else {
      // Nothing to play
      loadAudio('https://fanyi.sogou.com/reventondc/synthesis?text=Nothing%20to%20play&speed=1&lang=en&from=translateweb')
    }

    const waveformPitch = localStorage.getItem('waveform_pitch')
    updatePitchStretch(Boolean(waveformPitch))
  }, [])

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current!,
      waveColor: '#f9690e',
      progressColor: '#B71C0C',
      plugins: [RegionsPlugin.create()],
    })
  })
  const [pitchStretch, setPitchStretch] = useState(!isFirefox)
  function onTogglePlay () {
    isPlaying ? videoPause() : audioPlay()
  }

  const onTogglePitchStretch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePitchStretch(e.currentTarget.checked)
    localStorage.set('waveform_pitch', e.currentTarget.checked)
  }

  const updatePitchStretch = (flag: boolean) => {
    setPitchStretch(flag)

    // if (flag) {
    //   if (
    //     speed !== 1 &&
    //     wavesurfer.current &&
    //     wavesurfer.current.get.length <= 0
    //   ) {
    //     this.shouldSTSync = true
    //   }
    // } else {
    //   if (wavesurfer.current) {
    //     wavesurfer.current.backend.disconnectFilters()
    //   }
    // }
  }

  const audioPlay = () => {
    // setIsPlaying(true)
    // if (wavesurfer.current) {
    //   if (pitchStretch && soundTouchNode && wavesurfer.current.getFilters().length <= 0
    //   ) {
    //     wavesurfer.current.backend.setFilter(soundTouchNode)
    //   }
    //   if (this.region && !this.isInRegion()) {
    //     wavesurfer.current.play(this.region.start)
    //   } else {
    //     wavesurfer.current.play()
    //   }
    // }
    // this.shouldSTSync = true
  }

  const videoPause = () => {
    // setIsPlaying(false)
    // if (soundTouchNode) {
    //   soundTouchNode.disconnect()
    // }
    // if (wavesurfer.current) {
    //   wavesurfer.current.pause()
    //   wavesurfer.current.backend.disconnectFilters()
    // }
  }
  const onUpdateSpeed = (speed: number | null) => {
    if (speed === null) return
    setSpeed(speed)

    if (speed < 0.1 || speed > 3) {
      return
    }

    if (wavesurfer.current) {
      // wavesurfer.current.setPlaybackRate(speed)
      // if (speed !== 1 && pitchStretch && !this.soundTouch) {
      //   this.initSoundTouch(wavesurfer.current)
      // }
    }

    // this.shouldSTSync = true
  }
  const onToggleLoop = (ev: ChangeEvent<HTMLInputElement>) => {
    setLoop(ev.currentTarget.checked)
    if (ev.currentTarget.checked && !isPlaying) {
      audioPlay()
    }
  }
  return (<div className={clsx({ darkMode })}>
    <div className="saladict-waveformWrap saladict-theme">
      <div ref={containerRef} />
      <div className="saladict-waveformCtrl">
        <button
          type="button"
          className="saladict-waveformPlay"
          title="Play/Pause"
          onClick={onTogglePlay}
        >
          <div
            className={`saladict-waveformPlay_FG ${
              isPlaying ? ' isPlaying' : ''
            }`}
          />
        </button>
        <NumberEditor
          className="saladict-waveformSpeed"
          title="Speed"
          value={speed}
          min={0.1} // too low could cause error
          max={3}
          step={0.005}
          precision={3}
          onChange={onUpdateSpeed}
        />
        <label className="saladict-waveformBtn_label" title="Loop">
          {loop
            ? (<ReloadIcon />)
            : (<NoReloadIcon/>)}
          <input
            type="checkbox"
            checked={loop}
            onChange={onToggleLoop}
          />
        </label>
        <label
          className="saladict-waveformPitch saladict-waveformBtn_label"
          title="Pitch Stretch"
        >
          <SoundIcon
            fill={pitchStretch
              ? 'var(--color-font)'
              : 'var(--color-divider)'} />
          <input
            type="checkbox"
            checked={pitchStretch}
            onChange={onTogglePitchStretch}
          />
        </label>
      </div>
    </div>
  </div>)
}
