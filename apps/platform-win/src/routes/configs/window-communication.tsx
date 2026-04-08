import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Input, Card, Space, Tag, message } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useWindowCommunication } from '@/hooks/useWindowCommunication'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { AudioLines } from 'lucide-react'

export const Route = createFileRoute('/configs/window-communication')({
  component: RouteComponent,
})

function RouteComponent () {
  return <WindowCommunicationDemo />
}

/**
 * 窗口间通信示例组件
 * 演示如何在不同窗口之间发送消息
 */
export default function WindowCommunicationDemo () {
  const [messageText, setMessageText] = useState('')
  const [targetWindow, setTargetWindow] = useState<'config-view' | 'search-view'>('search-view')
  const [customEvent, setCustomEvent] = useState('custom-message')

  // 使用窗口通信 hook
  const { lastMessage, isListening, sendToTarget, broadcast } =
    useWindowCommunication<{ text: string; timestamp: number }>(
      'current-window',
      customEvent
    )

  // 获取当前窗口信息
  const currentWindow = getCurrentWindow()

  // 向指定窗口发送消息
  const handleSendToWindow = async () => {
    if (!messageText.trim()) {
      message.warning('请输入消息内容')
      return
    }

    try {
      await sendToTarget(targetWindow, customEvent, {
        text: messageText,
        timestamp: Date.now(),
      })
      message.success(`已向窗口 ${targetWindow} 发送消息`)
      setMessageText('')
    } catch (error) {
      message.error('发送失败')
      console.error(error)
    }
  }

  // 向所有窗口广播消息
  const handleBroadcast = async () => {
    if (!messageText.trim()) {
      message.warning('请输入消息内容')
      return
    }

    try {
      await broadcast('broadcast-message', {
        text: messageText,
        timestamp: Date.now(),
        from: currentWindow.label,
      })
      message.success('已广播消息到所有窗口')
      setMessageText('')
    } catch (error) {
      message.error('广播失败')
      console.error(error)
    }
  }

  // 预设的窗口标签
  const windowLabels = [
    { label: 'search-view', name: '搜索窗口' },
    { label: 'config-view', name: '配置窗口' },
  ] as const

  return (
    <Card
      title="窗口间通信示例"
      extra={
        <Tag color={isListening ? 'green' : 'red'}>
          {isListening ? '监听中' : '未监听'}
        </Tag>
      }
      style={{ margin: '20px' }}
    >
      <div >
        {/* 目标窗口选择 */}
        <div>
          <h4>1. 选择目标窗口</h4>
          <Space wrap>
            {windowLabels.map((win) => (
              <Button
                key={win.label}
                type={targetWindow === win.label ? 'primary' : 'default'}
                onClick={() => setTargetWindow(win.label)}
              >
                {win.name} ({win.label})
              </Button>
            ))}
          </Space>
        </div>

        {/* 自定义事件名称 */}
        <div>
          <h4>2. 事件名称</h4>
          <Input
            value={customEvent}
            onChange={(e) => setCustomEvent(e.target.value)}
            placeholder="输入自定义事件名称"
          />
        </div>

        {/* 消息输入 */}
        <div>
          <h4>3. 消息内容</h4>
          <Input.TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="输入要发送的消息内容"
            rows={3}
          />
        </div>

        {/* 操作按钮 */}
        <div>
          <h4>4. 发送消息</h4>
          <Space>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendToWindow}
            >
              发送到 {targetWindow}
            </Button>
            <Button
              icon={<AudioLines />}
              onClick={handleBroadcast}
            >
              广播到所有窗口
            </Button>
          </Space>
        </div>

        {/* 接收到的消息 */}
        {lastMessage && (
          <div>
            <h4>5. 接收到的消息</h4>
            <Card size="small" style={{ background: '#f5f5f5' }}>
              <p>
                <strong>内容:</strong> {lastMessage.text}
              </p>
              <p>
                <strong>时间:</strong>{' '}
                {new Date(lastMessage.timestamp).toLocaleString()}
              </p>
            </Card>
          </div>
        )}

        {/* 使用说明 */}
        <div>
          <h4>📖 使用说明</h4>
          <Card size="small">
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <strong>点对点通信:</strong> {'选择目标窗口，输入消息后点击"发送到目标窗口"'}
              </li>
              <li>
                <strong>广播通信:</strong> {'输入消息后点击"广播到所有窗口"'}
              </li>
              <li>
                <strong>监听消息:</strong> 当前窗口会自动监听来自其他窗口的事件
              </li>
              <li>
                <strong>测试方法:</strong> 打开两个窗口（搜索窗口和配置窗口），在一个窗口发送消息，另一个窗口会接收
              </li>
            </ol>
          </Card>
        </div>

        {/* 代码示例 */}
        <div>
          <h4>💻 代码示例</h4>
          <div >
            <pre
              style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
              }}
            >
              {`// 发送消息到指定窗口
import { sendToWindow } from '@/core/bridge'

await sendToWindow('search-view', 'custom-event', {
  text: 'Hello from config window!',
  timestamp: Date.now()
})

// 监听来自其他窗口的消息
import { listenFromWindow } from '@/core/bridge'

const unlisten = await listenFromWindow('custom-event', (payload) => {
  console.log('收到消息:', payload)
})

// 使用 React Hook
import { useWindowCommunication } from '@/hooks/useWindowCommunication'

const { lastMessage, sendToTarget, broadcast } = useWindowCommunication(
  'current-window',
  'custom-event'
)

// 发送消息
await sendToTarget('search-view', 'custom-event', { text: 'Hello!' })

// 广播消息
await broadcast('broadcast-event', { text: 'Hello all!' })`}
            </pre>
          </div>
        </div>
      </div>
    </Card>
  )
}
