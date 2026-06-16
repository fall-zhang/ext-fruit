import { cloneDeep } from 'es-toolkit'
import type { Profile } from './index'
import { getDefaultProfile } from './index'

/**
 * 对旧配置文件进行迁移
 * @returns
 */
export function mergeProfile (
  oldProfile: Profile,
  baseProfile?: Profile
): Profile {
  const base: Profile = baseProfile
    ? cloneDeep(baseProfile)
    : getDefaultProfile()

  return base
}
