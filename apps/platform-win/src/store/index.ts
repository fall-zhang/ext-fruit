import { create } from 'zustand'

import { createActionSlice, type DictActionSlice } from './actions/actions'
import { createSharedSlice, type GlobalState } from './global-state'


export const useDictStore = create<GlobalState & DictActionSlice>((...state) => {
  return {
    ...createSharedSlice(...state),
    ...createActionSlice(...state),
  }
})

