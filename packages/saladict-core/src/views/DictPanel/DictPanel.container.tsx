import { DictPanelPortal } from './DictPanel.portal'
import { MenuBarContainer } from '../MenuBar/MenuBar.container'
import { MtaBoxContainer } from '../MtaBox/MtaBox.container'
import { DictListContainer } from '../DictList/DictList.container'
import { WaveformBoxContainer } from '../WaveformBox/WaveformBox.container'
import { useDictStore } from '../../store'

const waveformBox = <WaveformBoxContainer />

export const DictPanelPortalContainer = () => {
  const props = useDictStore()
  const state = {
    show: props.isShowDictPanel,
    coord: props.dictPanelCoord,
    takeCoordSnapshot: props.wordEditor.isShow,
    width: props.config.panelWidth,
    height: props.panelHeight,
    maxHeight: props.panelMaxHeight,
    fontSize: props.config.fontSize,
    withAnimation: props.config.animation,
    panelCSS: props.config.panelCSS,
    darkMode: props.config.darkMode,
    menuBar: <MenuBarContainer />,
    mtaBox: props.isShowMtaBox ? <MtaBoxContainer /> : null,
    dictList: <DictListContainer />,
    waveformBox: props.activeProfile.waveform ? waveformBox : null,
    dragStartCoord: props.dragStartCoord,
  }

  function onDragEnd () {
    // dispatch({ type: 'DRAG_START_COORD', payload: null })
    state.dragStartCoord = null
  }
  return <>
    <DictPanelPortal {...state} onDragEnd={onDragEnd}/>
  </>
}

