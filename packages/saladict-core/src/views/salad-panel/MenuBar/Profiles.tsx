import type { FC } from 'react'
import type React from 'react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { OptionsBtn } from './MenubarBtns'
import { HoverBox, type HoverBoxItem } from '@P/saladict-core/src/components/HoverBox'
import { getProfileName } from 'apps/browser-extension/src/utils/profile-manager'

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
        // message.send({
        //   type: 'OPEN_URL',
        //   payload: { url: 'options.html', self: true },
        // })
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
