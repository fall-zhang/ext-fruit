import type { FC } from 'react'
import { FrownOutlined } from '@ant-design/icons'

export const EntryError: FC = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FrownOutlined
        style={{ fontSize: 80, color: '#eb2f96', marginBottom: 10 }}
      />
      <h1>Entry Not Found</h1>
    </div>
  )
}
