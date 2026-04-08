# Tauri 窗口间通信示例文档

## 概述

本项目演示了如何在 Tauri 应用的不同窗口之间进行通信。窗口间通信是实现跨窗口数据同步、事件通知等功能的关键技术。

## 核心概念

### 1. 事件驱动模型

Tauri 使用事件驱动模型实现窗口间通信：
- **emit**: 发送事件
- **listen**: 监听事件

### 2. 窗口标识

每个窗口都有一个唯一的 `label` 属性，用于标识目标窗口：
- `search-view`: 搜索窗口
- `config-view`: 配置窗口
- `new-window`: 新窗口

## 文件结构

```
src/
├── core/
│   └── bridge.ts                    # 窗口通信核心函数
├── hooks/
│   └── useWindowCommunication.ts    # React Hook 封装
├── components/
│   └── WindowCommunicationDemo/     # 示例组件
│       └── index.tsx
└── routes/
    └── configs/
        └── window-communication.tsx # 路由配置
```

## 使用方法

### 方式一：直接使用 bridge.ts 函数

#### 1. 向指定窗口发送消息

```typescript
import { sendToWindow } from '@/core/bridge'

// 向搜索窗口发送搜索词
await sendToWindow('search-view', 'search-term-changed', { 
  term: 'Hello World' 
})
```

#### 2. 监听来自其他窗口的事件

```typescript
import { listenFromWindow } from '@/core/bridge'

// 监听配置更新事件
const unlisten = await listenFromWindow('config-updated', (payload) => {
  console.log('配置已更新:', payload.key, payload.value)
})

// 在不需要时取消监听
unlisten()
```

#### 3. 向所有窗口广播消息

```typescript
import { broadcastToAllWindows } from '@/core/bridge'

// 广播事件到所有窗口
await broadcastToAllWindows('app-theme-changed', { 
  theme: 'dark' 
})
```

### 方式二：使用 React Hook（推荐）

```typescript
import { useWindowCommunication } from '@/hooks/useWindowCommunication'

function MyComponent() {
  // 使用 Hook 监听事件
  const { lastMessage, isListening, sendToTarget, broadcast } = 
    useWindowCommunication('config-view', 'config-updated')

  // 向配置窗口发送消息
  const handleSend = async () => {
    await sendToTarget('config-view', 'config-updated', {
      key: 'theme',
      value: 'dark'
    })
  }

  return (
    <div>
      {lastMessage && <p>收到消息: {lastMessage.key}</p>}
      <button onClick={handleSend}>发送</button>
    </div>
  )
}
```

## 实际应用场景

### 场景 1: 配置窗口通知搜索窗口更新

```typescript
// 在配置窗口中
import { sendToWindow } from '@/core/bridge'

const onConfigChange = async (key: string, value: any) => {
  // 通知搜索窗口配置已更新
  await sendToWindow('search-view', 'config-changed', { key, value })
}
```

```typescript
// 在搜索窗口中
import { useWindowCommunication } from '@/hooks/useWindowCommunication'

function SearchPanel() {
  const { lastMessage } = useWindowCommunication(
    'search-view',
    'config-changed'
  )

  useEffect(() => {
    if (lastMessage) {
      // 处理配置更新
      handleConfigUpdate(lastMessage.key, lastMessage.value)
    }
  }, [lastMessage])

  // ...
}
```

### 场景 2: 多窗口数据同步

```typescript
// 在任意窗口中广播数据
const broadcastData = async (data: any) => {
  await broadcastToAllWindows('data-sync', {
    ...data,
    timestamp: Date.now(),
    from: currentWindow.label
  })
}

// 在所有需要同步的窗口中监听
useWindowCommunication('current-window', 'data-sync')
```

### 场景 3: 窗口控制

```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

// 显示/隐藏窗口
const showWindow = async (label: string) => {
  const win = WebviewWindow.getByLabel(label)
  if (win) {
    await win.show()
  }
}

const hideWindow = async (label: string) => {
  const win = WebviewWindow.getByLabel(label)
  if (win) {
    await win.hide()
  }
}
```

## 示例页面

访问 `/configs/window-communication` 查看完整的示例页面，该页面演示了：

1. 选择目标窗口并发送消息
2. 自定义事件名称
3. 接收和显示来自其他窗口的消息
4. 广播消息到所有窗口
5. 完整的代码示例

## 测试步骤

1. 启动应用：`pnpm tauri dev`
2. 打开配置页面，导航到"窗口通信示例"
3. 打开另一个窗口（如搜索窗口）
4. 在示例页面中输入消息并选择目标窗口
5. 点击发送按钮，在目标窗口中查看接收到的消息

## 注意事项

### 1. 窗口生命周期

- 确保目标窗口存在后再发送消息
- 使用 `WebviewWindow.getByLabel()` 检查窗口是否存在

```typescript
const targetWindow = WebviewWindow.getByLabel('search-view')
if (!targetWindow) {
  console.warn('目标窗口不存在')
  return
}
```

### 2. 事件命名规范

- 使用有意义的、独特的事件名称
- 建议使用连字符分隔的命名方式：`config-changed`
- 避免使用通用名称：`message`, `data`

### 3. 错误处理

- 始终使用 try-catch 包装发送事件的调用
- 监听失败时要妥善处理错误

```typescript
try {
  await sendToWindow('search-view', 'custom-event', payload)
} catch (error) {
  console.error('发送事件失败:', error)
  // 处理错误...
}
```

### 4. 内存管理

- 在组件卸载时取消事件监听
- 使用 React Hook 会自动处理清理

### 5. 性能考虑

- 避免频繁发送大数据量
- 对于高频事件，考虑使用防抖或节流

## 高级用法

### 结合 Rust 后端

如果需要更复杂的窗口控制，可以在 Rust 端实现：

```rust
// 在 lib.rs 或 cmd.rs 中
use tauri::Manager;

#[tauri::command]
async fn control_window(app: tauri::AppHandle, action: String, window_label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&window_label) {
        match action.as_str() {
            "show" => window.show().map_err(|e| e.to_string())?,
            "hide" => window.hide().map_err(|e| e.to_string())?,
            "close" => window.close().map_err(|e| e.to_string())?,
            _ => return Err(format!("Unknown action: {}", action)),
        }
    }
    Ok(())
}
```

### 事件过滤

```typescript
// 只处理来自特定窗口的事件
const unlisten = await listen('custom-event', (event) => {
  const source = event.payload.from
  if (source === 'config-view') {
    // 只处理来自配置窗口的消息
    handleConfigMessage(event.payload)
  }
})
```

## 相关资源

- [Tauri 事件文档](https://tauri.app/v1/guides/features/events/)
- [Tauri WebviewWindow API](https://tauri.app/v1/api/js/webviewwindow/)
- [React Hooks 最佳实践](https://react.dev/reference/react)
