import type { FC } from 'react'
import type React from 'react'
import type { TFunction } from 'i18next'
export function getProfileName (name: string, t: TFunction): string {
  // default names
  const match = /^%%_(\S+)_%%$/.exec(name)
  if (match) {
    return t(`common:profile.${match[1]}`) || name
  }
  return name
}

export interface ProfilesProps {
  t: TFunction
  profiles: Array<{ id: string; name: string }>
  activeProfileId: string
  onSelectProfile: (id: string) => void
  onHeightChanged: (height: number) => void
}


