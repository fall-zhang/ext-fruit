import type { CSSProperties, FC, ReactNode } from 'react'
import React, { useRef } from 'react'
import clsx from 'clsx'
import { SALADICT_PANEL } from '@/_helpers/saladict'
import { HoverBoxContext } from '@/components/HoverBox'
import { useDictStore } from '../../store'
import MenuBarContainer from '../content/components/MenuBar/MenuBar.container'
import { WaveformBox } from '../content/components/WaveformBox/WaveformBox'

export interface DictPanelStandaloneProps {
  width: string
  height: string
  fontSize: number

  withAnimation: boolean
  darkMode: boolean
  panelCSS?: string

  menuBar: ReactNode
  mtaBox: ReactNode
  dictList: ReactNode
}

const menuBar = <MenuBarContainer />
const dictList = <DictListContainer />
export const DictPanelStandalone: FC<DictPanelStandaloneProps> = props => {
  const state = useDictStore((state) => {
    return {
      withAnimation: state.config.animation,
      darkMode: state.config.darkMode,
      panelCSS: state.config.panelCSS,
      fontSize: state.config.fontSize,
      menuBar,
      dictList,
      isShowMtaBox: state.isShowMtaBox,
      waveformBox: state.activeProfile.waveform,
    }
  })

  const rootElRef = useRef<HTMLDivElement | null>(null)

  return (
    // an extra layer as float box offest parent
    <div
      className={clsx('dictPanel-FloatBox-Container', {
        isAnimate: props.withAnimation,
        darkMode: props.darkMode,
      })}
    >
      <div ref={rootElRef} className="saladict-theme">
        {props.panelCSS ? <style>{props.panelCSS}</style> : null}
        <div
          className={`dictPanel-Root ${SALADICT_PANEL}`}
          style={{
            width: props.width,
            height: props.height,
            '--panel-width': props.width,
            '--panel-max-height': props.height,
            '--panel-font-size': props.fontSize + 'px',
          } as CSSProperties}
        >
          <div className="dictPanel-Head">{props.menuBar}</div>
          <HoverBoxContext.Provider value={rootElRef}>
            <div className="dictPanel-Body fancy-scrollbar">
              {state.isShowMtaBox && <MtaBoxContainer /> }
              {props.dictList}
            </div>
          </HoverBoxContext.Provider>
          {state.waveformBox && <WaveformBox />}
        </div>
      </div>
    </div>
  )
}

export default DictPanelStandalone
