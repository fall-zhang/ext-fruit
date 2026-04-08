# 窗口间通信示例 - 快速开始指南

## 📌 概述

这个示例演示了如何在 Tauri 应用的不同窗口之间进行通信。你可以在配置窗口发送消息，搜索窗口接收消息，反之亦然。

## 🚀 快速开始

### 1. 启动开发服务器

```bash
cd apps/platform-win
pnpm tauri dev
```

### 2. 打开两个窗口

1. **搜索窗口** - 默认启动时可见
2. **配置窗口** - 通过托盘菜单或快捷键打开

### 3. 测试窗口通信

#### 方法一：使用示例页面（推荐）

1. 在配置窗口中，导航到左侧菜单的 **"窗口通信示例"**
2. 你会看到一个完整的交互式演示界面
3. 选择目标窗口（如 `search-view`）
4. 输入消息内容
5. 点击 **"发送到 search-view"** 按钮
6. 在搜索窗口中查看接收到的消息

#### 方法二：手动测试

打开浏览器控制台（开发模式下），你可以看到所有事件的日志。

## 📂 文件说明

### 核心文件

- **`src/core/bridge.ts`**
  - 窗口通信的核心函数
  - `sendToWindow()` - 向指定窗口发送消息
  - `broadcastToAllWindows()` - 向所有窗口广播
  - `listenFromWindow()` - 监听来自其他窗口的事件

- **`src/hooks/useWindowCommunication.ts`**
  - React Hook 封装
  - 推荐在 React 组件中使用

- **`src/components/WindowCommunicationDemo/index.tsx`**
  - 完整的示例组件
  - 演示了所有通信方式

- **`src/routes/search-view/index.tsx`**
  - 搜索窗口示例
  - 展示了如何监听来自其他窗口的事件

### 文档

- **`docs/window-communication.md`**
  - 完整的文档说明
  - 包含所有使用场景和最佳实践

## 🎯 使用场景

### 场景 1: 配置同步

```typescript
// 在配置窗口中
await sendToWindow('search-view', 'config-updated', {
  key: 'theme',
  value: 'dark'
})
```

### 场景 2: 广播消息

```typescript
// 向所有窗口广播
await broadcastToAllWindows('app-theme-changed', {
  theme: 'dark'
})
```

### 场景 3: 使用 React Hook

```typescript
const { lastMessage, sendToTarget, broadcast } = 
  useWindowCommunication('search-view', 'custom-event')

// 发送消息
await sendToTarget('config-view', 'custom-event', { text: 'Hello!' })
```

## 🔍 如何验证

### 验证步骤

1. ✅ 启动应用后，打开配置页面的"窗口通信示例"
2. ✅ 在示例页面中输入测试消息
3. ✅ 选择目标窗口为 `search-view`
4. ✅ 点击发送按钮
5. ✅ 在搜索窗口中应该看到消息提示

### 调试技巧

在开发模式下，打开浏览器控制台可以看到：
- 发送事件的日志
- 接收事件的日志
- 错误信息（如果有）

## ⚠️ 常见问题

### Q: 消息没有发送成功？

**A:** 检查以下几点：
1. 目标窗口是否存在且已加载
2. 事件名称是否正确
3. 查看浏览器控制台是否有错误信息

### Q: 消息没有接收成功？

**A:** 检查以下几点：
1. 是否正确设置了事件监听器
2. 事件名称是否匹配
3. 监听器是否在正确的生命周期内设置

### Q: 如何知道当前有哪些窗口？

**A:** 可以使用以下代码获取所有窗口：

```typescript
import { getAllWindows } from '@tauri-apps/api/webviewWindow'

const windows = await getAllWindows()
console.log('当前窗口:', windows.map(w => w.label))
```

## 📚 更多资源

- 查看完整文档：`docs/window-communication.md`
- Tauri 官方文档：https://tauri.app
- 示例代码中的注释包含详细的使用说明

## 💡 提示

- 示例页面包含完整的代码示例，可以直接复制使用
- 所有的通信函数都有完善的错误处理
- React Hook 会自动清理监听器，避免内存泄漏

## 🎉 下一步

掌握了基本的窗口间通信后，你可以：

1. 实现配置实时同步
2. 实现多窗口数据共享
3. 实现窗口间的复杂交互
4. 结合 Rust 后端实现更强大的功能

祝你编码愉快！ 🚀
