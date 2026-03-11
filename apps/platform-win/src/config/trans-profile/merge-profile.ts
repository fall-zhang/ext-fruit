import { cloneDeep } from 'es-toolkit'
import type { Profile, ProfileMutable } from './index'
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
    : getDefaultProfile(oldProfile.id)

  return base
}
