// import type { ProfileID } from '@P/saladict-core/src/app-config/profiles'

import type { ProfileID } from '@P/saladict-core/src/app-config/profiles'
import type { TFunction } from 'i18next'

export async function updateProfileIDList (profiles: ProfileID[]) {

}
export async function addProfile (profileId: ProfileID) {

}


export function getProfileName (name: string, t: TFunction): string {
  // default names
  const match = /^%%_(\S+)_%%$/.exec(name)
  if (match) {
    return t(`common:profile.${match[1]}`) || name
  }
  return name
}
