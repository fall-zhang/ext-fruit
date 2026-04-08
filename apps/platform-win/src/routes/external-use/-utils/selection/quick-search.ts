import { EMPTY, merge } from 'rxjs'
import { share, buffer, debounceTime, filter } from 'rxjs/operators'
import type { AppConfig } from '@/config/app-config'
import { whenKeyPressed, isQSKey } from './helper'

/**
 * Listen to triple-ctrl shortcut which opens quick search panel.
 * Pressing ctrl/command key more than three times within 500ms
 * triggers triple-ctrl.
 */
export function createQuickSearchStream (config: AppConfig | null) {
  return EMPTY
}
