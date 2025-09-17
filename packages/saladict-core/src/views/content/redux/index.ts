import {
  UnknownAction
} from 'redux'
import { configureStore as createReduxStore } from '@reduxjs/toolkit'
import {
  useSelector as _useSelector,
  useDispatch as _useDispatch
} from 'react-redux'
import { createEpicMiddleware } from 'redux-observable'
import { Observable } from 'rxjs'
import { map, distinctUntilChanged, startWith } from 'rxjs/operators'
import { message } from '@/_helpers/browser-api'
import { reportPageView } from '@/_helpers/analytics'
import { isPDFPage, isPopupPage, isStandalonePage } from '@/_helpers/saladict'

import {
  StoreState,
  StoreAction,
  StoreDispatch
} from './modules'
import { init } from './init'
import { epics } from './epics'

// const epicMiddleware = createEpicMiddleware<StoreAction, StoreAction, StoreState>()
const epicMiddleware = createEpicMiddleware()

type UseSelectorType<T=any> = {
  (
    selector: { (state: StoreState):T },
    equalityFn?: { (left: T, right: T) :boolean }
  ):T
}
export const useSelector:UseSelectorType = _useSelector

export const useDispatch: () => StoreDispatch = _useDispatch

export const createStore = async () => {
  const store = createReduxStore({
    reducer: function (state: any, action: UnknownAction) {
      throw new Error('Function not implemented.')
    }
  })

  epicMiddleware.run(epics)

  init(store.dispatch, store.getState)

  // sync state
  const storeState$ = new Observable<StoreState>(observer => {
    store.subscribe(() => observer.next(store.getState()))
  })

  storeState$
    .pipe(
      map(state => state.isPinned),
      distinctUntilChanged()
    )
    .subscribe(isPinned => {
      message.self.send({
        type: 'PIN_STATE',
        payload: isPinned
      })
    })

  storeState$
    .pipe(
      map(state => state.isShowDictPanel),
      startWith(false),
      distinctUntilChanged()
    )
    .subscribe(isShowDictPanel => {
      if (isShowDictPanel) {
        if (isPopupPage()) {
          reportPageView('/popup')
        } else if (isPDFPage()) {
          reportPageView('/pdf-dictpanel')
        } else if (isStandalonePage()) {
          reportPageView('/standalone')
        } else {
          reportPageView('/dictpanel')
        }
      }
    })

  message.addListener('QUERY_PIN_STATE', queryStoreState)
  message.self.addListener('QUERY_PIN_STATE', queryStoreState)

  async function queryStoreState () {
    return store.getState().isPinned
  }

  return store
}
