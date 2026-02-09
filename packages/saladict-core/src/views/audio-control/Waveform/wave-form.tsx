import { isFirefox } from '@P/saladict-core/src/utils/browser'
import clsx from 'clsx'
import { useEffect, useRef, useState, type FC, type ChangeEvent } from 'react'
import { InputNumber as NumberEditor } from 'antd'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'

export const WaveFormView:FC<{
  darkMode:boolean
}> = ({ darkMode }) => {
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [loop, setLoop] = useState(false)

  const wavesurfer = useRef<WaveSurfer | null>(null)

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

    if (flag) {
      if (
        speed !== 1 &&
        this.soundTouchNode &&
        wavesurfer.current &&
        wavesurfer.current.getFilters().length <= 0
      ) {
        this.wavesurfer.backend.setFilter(this.soundTouchNode)
        this.shouldSTSync = true
      }
    } else {
      if (this.soundTouchNode) {
        this.soundTouchNode.disconnect()
      }
      if (this.wavesurfer) {
        this.wavesurfer.backend.disconnectFilters()
      }
    }
  }

  const audioPlay = () => {
    setIsPlaying(true)
    if (wavesurfer.current) {
      if (
        pitchStretch &&
        this.soundTouchNode &&
        this.wavesurfer.getFilters().length <= 0
      ) {
        this.wavesurfer.backend.setFilter(this.soundTouchNode)
      }
      if (this.region && !this.isInRegion()) {
        this.wavesurfer.play(this.region.start)
      } else {
        this.wavesurfer.play()
      }
    }
    this.shouldSTSync = true
  }

  const videoPause = () => {
    setIsPlaying(false)
    if (this.soundTouchNode) {
      this.soundTouchNode.disconnect()
    }
    if (this.wavesurfer) {
      this.wavesurfer.pause()
      this.wavesurfer.backend.disconnectFilters()
    }
  }
  const onUpdateSpeed = (speed: number | null) => {
    if (speed === null) return
    setSpeed(speed)

    if (speed < 0.1 || speed > 3) {
      return
    }

    if (this.wavesurfer) {
      this.wavesurfer.setPlaybackRate(speed)
      if (speed !== 1 && pitchStretch && !this.soundTouch) {
        this.initSoundTouch(this.wavesurfer)
      }
      if (this.soundTouch) {
        this.soundTouch.tempo = speed
      }
    }

    this.shouldSTSync = true
  }
  const onToggleLoop = (ev:ChangeEvent<HTMLInputElement>) => {
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
            className={`saladict-waveformPlay_FG${
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
            ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="var(--color-font)"
              >
                <path d="M23.242 388.417l162.59 120.596v-74.925h300.281l-.297-240.358-89.555-.239-.44 150.801H185.832l.81-75.934-163.4 120.06z" />
                <path d="M490.884 120.747L328.294.15l.001 74.925H28.013l.297 240.358 89.555.239.44-150.801h209.99l-.81 75.934 163.4-120.06z" />
              </svg>
            )
            : (
              <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                fill="var(--color-divider)"
              >
                <path d="M 23.242 388.417 L 23.243 388.417 L 23.242 388.418 Z M 23.243 388.418 L 186.642 268.358 L 185.832 344.292 L 283.967 344.292 L 331.712 434.088 L 185.832 434.088 L 185.832 509.013 Z M 395.821 344.292 L 396.261 193.491 L 485.816 193.73 L 486.113 434.088 L 388.064 434.088 L 340.319 344.292 Z" />
                <path d="M 490.884 120.747 L 490.883 120.746 L 490.885 120.745 Z M 490.883 120.746 L 327.485 240.805 L 328.295 164.871 L 244.267 164.871 L 196.521 75.075 L 328.295 75.075 L 328.294 0.15 Z M 118.305 164.871 L 117.865 315.672 L 28.31 315.433 L 28.013 75.075 L 141.077 75.075 L 188.823 164.871 Z" />
                <rect
                  x="525.825"
                  y="9.264"
                  width="45.879"
                  height="644.398"
                  transform="matrix(0.882947, -0.469472, 0.469472, 0.882947, -403.998657, 225.106232)"
                />
              </svg>
            )}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 467.987 467.987"
            fill={
              pitchStretch
                ? 'var(--color-font)'
                : 'var(--color-divider)'
            }
          >
            <path d="M70.01 146.717h47.924V321.27H70.01zM210.032 146.717h47.924V321.27h-47.924zM350.053 146.717h47.924V321.27h-47.924zM0 196.717h47.924v74.553H0zM280.042 196.717h47.924v74.553h-47.924zM420.063 196.717h47.924v74.553h-47.924zM140.021 96.717h47.924V371.27h-47.924z" />
          </svg>
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
