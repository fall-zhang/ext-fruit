fn main() {
    // 构建 Tauri 应用，包含 Windows 安装包描述信息
    // 安装包的元数据在 tauri.conf.json 的 bundle.windows 部分配置
    tauri_build::build()
}
