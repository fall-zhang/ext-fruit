## 开发内容

- 因为安全策略，只能选择相对路径中的文件进行操作，如果想要对任意绝对路径下的内容操作，需要使用 rust 重写这些内容

默认工作区

C:\Users\Administrator\AppData\Roaming\less-process\workspace

## 支持的系统

- 支持系统：win11，win10（Version 1803 and later with all updates applied）

### 更新依赖

```bash
# 更新 rust 以获取性能或功能的提升
rustup update
#
cargo update

```

> 卸载 rust `rustup self uninstall`

## debug

### 打印到控制台

```rs
println!("Message from Rust: {}", msg);
```

### 命令行 debug

windows

```powershell
set RUST_BACKTRACE=1
tauri dev
```

```bash
RUST_BACKTRACE=1 tauri dev
```
