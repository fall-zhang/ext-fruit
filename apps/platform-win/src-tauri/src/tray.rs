use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};

// 创建托盘图标和菜单
pub fn create_tray_menu(app: &AppHandle) -> Result<(), tauri::Error> {
    // 创建菜单项 - 使用 MenuItem::new 简化
    let show_search = MenuItem::with_id(app, "show_search", "显示搜索面板", true, None::<&str>)?;
    let show_config = MenuItem::with_id(app, "show_config", "显示配置页面", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;

    // 创建菜单
    let menu = Menu::new(app)?;
    menu.append(&show_search)?;
    menu.append(&show_config)?;
    menu.append(&quit)?;

    // 创建托盘图标
    let tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Fruit Saladict")
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                println!("quit menu item was clicked");
                app.exit(0);
            }
            _ => {
                println!("menu item {:?} not handled", event.id);
            }
        })
        .show_menu_on_left_click(false) // 禁用左键点击菜单，使用自定义处理
        .on_tray_icon_event(move |tray, event| {
            handle_tray_event(tray, event);
        })
        .build(app)?;

    // 存储托盘引用到应用状态
    app.manage(tray);

    Ok(())
}

// 处理托盘事件
fn handle_tray_event(tray: &tauri::tray::TrayIcon, event: TrayIconEvent) {
    let app = tray.app_handle();

    match event {
        TrayIconEvent::Click { button, .. } => {
            if button == MouseButton::Left {
                // 单击左键：显示搜索面板
                show_search_panel(&app);
            }
            if button == MouseButton::Right {
                // 单击左键：显示搜索面板
                show_search_panel(&app);
            }
            // 右键点击会自动显示菜单
        }
        TrayIconEvent::DoubleClick { button, .. } => {
            if button == MouseButton::Left {
                // 双击左键：显示配置页面
                show_config_page(&app);
            }
        }
        _ => {}
    }
}

// 显示搜索面板
fn show_search_panel(app: &AppHandle) {
    // 尝试获取主窗口
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.unminimize();
        // 导航到搜索页面
        let _ = window.eval("window.location.href = '/search-view';");
    } else {
        // 如果主窗口不存在，创建新窗口
        let _ = tauri::WebviewWindowBuilder::new(
            app,
            "main",
            tauri::WebviewUrl::App("/search-view".into()),
        )
        .title("Fruit Saladict - 搜索")
        .inner_size(800.0, 600.0)
        .min_inner_size(400.0, 300.0)
        .visible(true)
        .build();
    }
}

// 显示配置页面
fn show_config_page(app: &AppHandle) {
    // 尝试获取主窗口
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.unminimize();
        // 导航到配置页面
        let _ = window.eval("window.location.href = '/config';");
    } else {
        // 如果主窗口不存在，创建新窗口
        let _ =
            tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App("/config".into()))
                .title("Fruit Saladict - 配置")
                .inner_size(900.0, 700.0)
                .min_inner_size(500.0, 400.0)
                .visible(true)
                .build();
    }
}
