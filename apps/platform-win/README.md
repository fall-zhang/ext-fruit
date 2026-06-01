## 开发内容

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
