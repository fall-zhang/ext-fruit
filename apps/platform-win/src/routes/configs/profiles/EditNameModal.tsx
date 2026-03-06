import type { FC } from 'react'
import React, { useRef } from 'react'
import { Input, Modal, type InputRef } from 'antd'
import type { ProfileID } from '@P/saladict-core/src/app-config/profiles'

export interface EditNameModalProps {
  title: string
  show: boolean
  profileID: ProfileID | null
  onClose: (newProfileID?: ProfileID) => void
}

export const EditNameModal: FC<EditNameModalProps> = props => {
  const [inputVal, setInputVal] = React.useState<string>(props.profileID?.name || '')

  return (
    <Modal
      visible={props.show}
      title={props.title}
      onOk={() => {
        const name = (inputVal || '').trim()
        if (name && props.profileID) {
          props.onClose({
            ...props.profileID,
            name,
          })
        } else {
          props.onClose()
        }
      }}
      onCancel={() => props.onClose()}
    >
      <Input value={inputVal} onChange={(ev) => setInputVal(ev.target.value)} autoFocus defaultValue={props.profileID?.name} />
    </Modal>
  )
}
