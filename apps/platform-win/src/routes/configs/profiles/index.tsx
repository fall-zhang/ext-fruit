import { createFileRoute } from '@tanstack/react-router'
import { useState, useLayoutEffect } from 'react'
import { Row, Col, Modal, notification, message as antdMsg } from 'antd'
import { BlockOutlined } from '@ant-design/icons'

import { SortableList, reorder } from '../-components/SortableList'
import { EditNameModal } from './-edit-name-modal'
import { useDictStore } from '@/store'
import { Trans, useTranslation } from 'react-i18next'
import { useListLayout } from '../-utils/layout'
import { useCheckDictAuth } from '../-utils/use-check-dict-auth'
import { addProfile, getProfileName, updateProfileIDList } from './-utils'
import { removeProfile, updateActiveProfileID, getDefaultProfileID, type ProfileID } from '@/core/api-local/profile'

export const Route = createFileRoute('/configs/profiles/')({
  component: RouteComponent,
})

/**
 * 对应用中所有的内容进行配置
 */
function RouteComponent () {
  const { t } = useTranslation('options')
  const checkDictAuth = useCheckDictAuth()
  const { activeProfileID, storeProfileIDList } = useDictStore(state => {
    return {
      activeProfileID: state.activeProfile.id,
      storeProfileIDList: state.profiles,
    }
  })
  const [showAddProfileModal, setShowAddProfileModal] = useState(false)
  const [showEditNameModal, setShowEditNameModal] = useState(false)
  const [editingProfileID, setEditingProfileID] = useState<ProfileID | null>(
    null
  )
  const listLayout = useListLayout()
  // make a local copy to avoid flickering on drag end
  const [profileIDList, setProfileIDList] = useState<ProfileID[]>(
    storeProfileIDList
  )
  useLayoutEffect(() => {
    setProfileIDList(storeProfileIDList)
  }, [storeProfileIDList])

  const tryToRun = async (action: () => any): Promise<void> => {
    try {
      await action()
      antdMsg.destroy()
      antdMsg.success(t('msg_updated'))
    } catch (error) {
      console.error({
        message: 'Error',
        description: error,
      })
    }
  }

  const onEditNameModalClose = (profileID?: ProfileID) => {
    setShowAddProfileModal(false)
    setShowEditNameModal(false)

    if (profileID) {
      tryToRun(async () => {
        if (profileIDList.find(({ id }) => id === profileID.id)) {
          const newList = profileIDList.map(p =>
            (p.id === profileID.id ? profileID : p)
          )
          updateProfileIDList(newList)
        } else {
          await addProfile(profileID)
        }
      })
    }
  }

  return (
    <Row>
      <Col {...listLayout}>
        <SortableList
          title={t('nav.Profiles')}
          description={
            <Trans message={t('profiles.opt.help')}>
              <BlockOutlined style={{ color: '#f5222d' }} />
              <kbd>↓</kbd>
            </Trans>
          }
          selected={activeProfileID}
          list={profileIDList.map(({ id, name }) => ({
            value: id,
            title: getProfileName(name, t),
          }))}
          onSelect={async ({ target: { value } }) => {
            if (await checkDictAuth()) {
              tryToRun(() => updateActiveProfileID(value))
            }
          }}
          onAdd={() => {
            setEditingProfileID({
              ...getDefaultProfileID(),
              name: '',
            })
            setShowAddProfileModal(true)
          }}
          onEdit={index => {
            setEditingProfileID(
              profileIDList[index]
                ? {
                  ...profileIDList[index],
                  name: getProfileName(profileIDList[index].name, t),
                }
                : getDefaultProfileID()
            )
            setShowEditNameModal(true)
          }}
          onDelete={index => {
            const { id, name } = profileIDList[index]
            Modal.confirm({
              title: t('profiles.opt.delete_confirm', {
                name: getProfileName(name, t),
              }),
              onOk: () => tryToRun(() => removeProfile(id)),
            })
          }}
          onOrderChanged={(oldIndex, newIndex) => {
            const newList = reorder(profileIDList, oldIndex, newIndex)
            setProfileIDList(newList)
            tryToRun(() => updateProfileIDList(newList))
          }}
        />
        <EditNameModal
          title={t('profiles.opt.add_name')}
          show={showAddProfileModal}
          profileID={editingProfileID}
          onClose={onEditNameModalClose}
        />
        <EditNameModal
          title={t('profiles.opt.edit_name')}
          show={showEditNameModal}
          profileID={editingProfileID}
          onClose={onEditNameModalClose}
        />
      </Col>
    </Row>
  )
}
