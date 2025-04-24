import { Observable } from 'rxjs'
import { Epic as RawEpic, ofType as rawOfType } from 'redux-observable'
import { StoreAction, StoreActionType, StoreState } from '../modules'

/** Tailored `Epic` for the store. */
export type Epic<
  TOutType extends StoreActionType = StoreActionType,
  TDeps = any
> = RawEpic<StoreAction, StoreAction<TOutType>, StoreState, TDeps>

