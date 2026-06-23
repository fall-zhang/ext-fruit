## saladict-win

## 支持的系统

- 支持系统：win11，win10（Version 1803 and later with all updates applied）

### 如何启动

本地环境 node 22 或以上，rust latest

```bash
npm i pnpm -g

pnpm i

pnpm tauri dev
```

### 更新依赖

```bash
# 更新 rust 以获取性能或功能的提升
rustup update
# 更新依赖
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
