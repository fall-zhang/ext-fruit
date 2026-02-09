import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Form, Switch, message as antdMsg } from 'antd'
import { useTranslation } from 'react-i18next'

const permissions = ['clipboardRead', 'clipboardWrite'] as const

export const Permissions: FC = () => {
  const { t } = useTranslation(['options', 'common'])

  const [status, setStatus] = useState(() =>
    permissions.reduce((status, permission) => {
      status[permission] = false
      return status
    }, {} as { [p in typeof permissions[number]]: boolean })
  )

  useEffect(() => {
    Promise.all(
      permissions.map(async permission => {
        try {
          return await browser.permissions.contains({
            permissions: [permission],
          })
        } catch (e) {
          console.error(e)
        }
        return false
      })
    ).then(contains => {
      setStatus(
        permissions.reduce((status, permission, i) => {
          status[permission] = contains[i]
          return status
        }, {} as { [p in typeof permissions[number]]: boolean })
      )
    }).catch(err => {
      console.warn(err)
    })
  }, [])

  return (
    <Form>
      {permissions.map(permission => (
        <Form.Item
          key={permission}
          label={t(`permissions.${permission}`)}
          help={t(`permissions.${permission}_help`)}
        >
          <Switch
            checked={status[permission]}
            onChange={async checked => {
              if (checked) {
                try {
                  if (
                    !(await browser.permissions.request({
                      permissions: [permission],
                    }))
                  ) {
                    antdMsg.warning(t('permissions.cancelled'))
                    return
                  }
                  antdMsg.success(t('permissions.success'))
                  setStatus(status => ({
                    ...status,
                    [permission]: true,
                  }))
                } catch (e) {
                  console.error(e)
                  antdMsg.error(t('permissions.failed'))
                }
              } else {
                await browser.permissions.remove({
                  permissions: [permission],
                })
                antdMsg.success(t('permissions.cancel_success'))
                setStatus(status => ({
                  ...status,
                  [permission]: false,
                }))
              }
            }}
          />
        </Form.Item>
      ))}
    </Form>
  )
}
