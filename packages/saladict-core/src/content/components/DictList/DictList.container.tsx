import {
  connect,
  MapStateToProps,
  MapDispatchToPropsFunction
} from 'react-redux'

import memoizeOne from 'memoize-one'
import { StoreState, StoreDispatch } from '@/content/redux/modules'
import { message } from '@/_helpers/browser-api'
import { DictList, DictListProps } from './DictList'

const memoizedDicts = memoizeOne(
  (
    renderedDicts: StoreState['renderedDicts'],
    allDict: StoreState['activeProfile']['dicts']['all']
  ) =>
    renderedDicts.map(dict => ({
      dictID: dict.id,
      searchStatus: dict.searchStatus,
      searchResult: dict.searchResult,
      catalog: dict.catalog,
      preferredHeight: allDict[dict.id].preferredHeight
    }))
)

const mapStateToProps: MapStateToProps<
  StoreState,
  DictListProps,
  any
> = state => {
  const { config } = state
  return {
    darkMode: config.darkMode,
    withAnimation: config.animation,
    panelCSS: config.panelCSS,
    touchMode: config.touchMode,
    language: config.language,
    doubleClickDelay: config.doubleClickDelay,
    dicts: memoizedDicts(state.renderedDicts, state.activeProfile.dicts.all)
  }
}

const mapDispatchToProps: MapDispatchToPropsFunction<
  StoreDispatch,
  DictListProps
> = dispatch => ({
  searchText: (payload: any) => {
    dispatch({ type: 'SEARCH_START', payload })
  },
  openDictSrcPage: (id, ctrlKey) => {
    dispatch((_dispatch, getState) => {
      const { searchHistory } = getState()
      const word = searchHistory[searchHistory.length - 1]
      message.send({
        type: 'OPEN_DICT_SRC_PAGE',
        payload: {
          id,
          text: word && word.text ? word.text : '',
          active: !ctrlKey
        }
      })
    })
  },
  onHeightChanged: height => {
    dispatch({
      type: 'UPDATE_PANEL_HEIGHT',
      payload: { area: 'dictlist', height }
    })
  },
  onUserFold: (id, fold) => {
    dispatch({ type: 'USER_FOLD_DICT', payload: { id, fold } })
  },
  onSpeakerPlay: src => {
    return new Promise(resolve => {
      dispatch((dispatch, getState) => {
        if (getState().isExpandWaveformBox) {
          message.self.send({ type: 'PLAY_AUDIO', payload: src }).then(resolve)
        } else {
          message.send({ type: 'PLAY_AUDIO', payload: src }).then(resolve)
        }
        dispatch({
          type: 'PLAY_AUDIO',
          payload: { src, timestamp: Date.now() }
        })
      })
    })
  },
  newSelection: (payload: StoreState['selection']) => {
    dispatch({ type: 'NEW_SELECTION', payload })
  }
})

export const DictListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DictList)

export default DictListContainer
