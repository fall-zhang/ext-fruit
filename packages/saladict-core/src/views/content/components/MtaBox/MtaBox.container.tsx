import { newWord } from '@P/saladict-core/src/dict-utils/new-word'
import { MtaBox } from './MtaBox'

const mapDispatchToProps = dispatch => ({
  searchText: text => {
    dispatch({ type: 'SEARCH_START', payload: { word: newWord({ text }) } })
  },
  onInput: text => {
    dispatch({ type: 'UPDATE_TEXT', payload: text })
  },
  onDrawerToggle: () => {
    dispatch({ type: 'TOGGLE_MTA_BOX' })
  },
  onHeightChanged: height => {
    dispatch({
      type: 'UPDATE_PANEL_HEIGHT',
      payload: { area: 'mtabox', height },
    })
  },
})

export const MtaBoxContainer = connect(
  mapDispatchToProps
)(MtaBox)

export default MtaBoxContainer
