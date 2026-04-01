import type { FC } from 'react'
import type React from 'react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { OptionsBtn } from './MenubarBtns'
import { HoverBox, type HoverBoxItem } from '@/components/HoverBox'
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

/**
 * Pick and choose profiles
 */
export const ProfilePopover: FC<ProfilesProps> = props => {
  const { t } = useTranslation(['common'])

  const listItems: HoverBoxItem[] = props.profiles.map(p => {
    return {
      key: p.id,
      value: p.id,
      label: (
        <span
          className={`menuBar-ProfileItem${
            p.id === props.activeProfileId ? ' isActive' : ''
          }`}
        >
          {getProfileName(p.name, t)}
        </span>
      ),
    }
  })

  return (
    <HoverBox
      Button={ProfilesBtn}
      items={listItems}
      onBtnClick={() => {
        return false
      }}
      onSelect={props.onSelectProfile}
      onHeightChanged={props.onHeightChanged}
    />
  )
}

function ProfilesBtn (props: React.ComponentProps<'button'>) {
  return <OptionsBtn {...props} />
}
