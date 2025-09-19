use tauri::Manager;
// 使用 tauri 打开 web 控制台
fn main() {
    tauri::Builder::default().setup(|app| {
        #[cfg(debug_assertions)] // only include this code on debug builds
        {
            let window = app.get_window("main").unwrap();
            window.open_devtools();
            // window.close_devtools();
        }
        Ok(())
    });
}
