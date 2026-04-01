use std::sync::OnceLock;
use std::time::{Duration, Instant};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};
use tauri_plugin_positioner::{Position, WindowExt};
use std::sync::Mutex;

// 点击状态管理
struct ClickState {
    last_click_time: Instant,
    click_count: u32,
    pending_timer: bool, // 是否有待处理的定时器
}

static CLICK_STATE: OnceLock<Mutex<ClickState>> = OnceLock::new();

// 初始化点击状态
fn init_click_state() -> &'static Mutex<ClickState> {
    CLICK_STATE.get_or_init(|| {
        Mutex::new(ClickState {
            last_click_time: Instant::now() - Duration::from_secs(1), // 设置为过去时间
            click_count: 0,
            pending_timer: false,
        })
    })
}

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
    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Fruit Saladict")
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                println!("quit menu item was clicked");
                app.exit(0);
            }
            "show_config" => {
                show_config_page(app);
            }
            _ => {
                println!("menu item {:?} not handled", event.id);
            }
        })
        .show_menu_on_left_click(false) // 禁用左键点击菜单，使用自定义处理
        .on_tray_icon_event(move |app, event| {
            tauri_plugin_positioner::on_tray_event(app.app_handle(), &event);
            handle_tray_event(app, event);
        })
        .build(app)?;

    // 存储托盘引用到应用状态
    // app.manage(tray);

    Ok(())
}

// 处理托盘事件
fn handle_tray_event(tray: &tauri::tray::TrayIcon, event: TrayIconEvent) {
    let app = tray.app_handle();
    // tauri_plugin_positioner::on_tray_event(app, &event);

    match event {
        TrayIconEvent::Click { button, .. } => {
            if button == MouseButton::Left {
                handle_left_click(&app);
            }
            if button == MouseButton::Right {
                // 单击右键：显示搜索面板
                // show_search_panel(&app);
            }
            // 右键点击会自动显示菜单
        }
        // TrayIconEvent::DoubleClick { button, .. } => {
        //     if button == MouseButton::Left {
        //         // 双击左键：显示配置页面
        //         show_config_page(&app);
        //     }
        // }
        _ => {}
    }
}

// 处理左键单击
fn handle_left_click(app: &AppHandle) {
    let state = init_click_state();
    let mut state_guard = state.lock().unwrap();
    let now = Instant::now();
    let double_click_threshold = Duration::from_millis(200);
    
    let time_since_last = now.duration_since(state_guard.last_click_time);
    // println!("托盘单击: time_since_last = {:?}, threshold = {:?}, pending_timer = {}, click_count = {}",
    //          time_since_last, double_click_threshold, state_guard.pending_timer, state_guard.click_count);
    // 添加 12 ms 的防抖
    if time_since_last < Duration::from_millis(12){
        return;
    }
    // 检查是否在双击阈值内
    if time_since_last < double_click_threshold {
        // println!("检测为双击，打开配置页面");
        // 双击检测到，打开配置页面
        state_guard.last_click_time = now;
        state_guard.click_count = 0;
        state_guard.pending_timer = false;
        drop(state_guard); // 释放锁
        
        show_config_page(app);
    } else {
        // println!("第一次单击或超过阈值，启动定时器");
        // 第一次点击或超过阈值
        state_guard.last_click_time = now;
        state_guard.click_count = 1;
        state_guard.pending_timer = true;
        let app_clone = app.clone();
        drop(state_guard); // 释放锁，避免在异步任务中持有锁
        
        // 启动定时器任务
        tauri::async_runtime::spawn(async move {
            tokio::time::sleep(double_click_threshold).await;
            
            // 检查是否仍然是待处理状态
            let state = init_click_state();
            let mut state_guard = state.lock().unwrap();
            if state_guard.pending_timer && state_guard.click_count == 1 {
                // println!("定时器触发，没有第二次点击，打开搜索面板");
                // 没有第二次点击，打开搜索面板
                state_guard.pending_timer = false;
                drop(state_guard);
                show_search_panel(&app_clone);
            } else {
                // println!("定时器触发，但状态已改变: pending_timer = {}, click_count = {}",
                //          state_guard.pending_timer, state_guard.click_count);
            }
        });
    }
}

// 显示搜索面板
fn show_search_panel(app: &AppHandle) {
    // 获取搜索面板
    if let Some(window) = app.get_webview_window("search-view") {
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.unminimize();
        let _ = window.move_window(Position::BottomRight);
        // let _ = window.move_window(Position::BottomRight);
        // 使用 tauri_plugin_positioner 将窗口移动到屏幕右下角
        // 首先尝试获取当前显示器信息
        // if let Ok(Some(monitor)) = window.current_monitor() {
        //     let monitor_size = monitor.size();
        //     let monitor_position = monitor.position();

        //     // 计算右下角坐标
        //     let screen_width = monitor_size.width as f64;
        //     let screen_height = monitor_size.height as f64;

        //     // 获取窗口大小
        //     if let Ok(size) = window.inner_size() {
        //         // 在 Tauri 2 中，inner_size() 返回 PhysicalSize<u32>
        //         let window_width = size.width as f64;
        //         let window_height = size.height as f64;

        //         let x = monitor_position.x as f64 + screen_width - window_width;
        //         let y = monitor_position.y as f64 + screen_height - window_height;

        //         let _ = window.set_position(tauri::Position::Physical(
        //             tauri::PhysicalPosition {
        //                 x: x as i32,
        //                 y: y as i32
        //             }
        //         ));
        //     }
        // }

        // 导航到搜索页面
        // let _ = window.eval("window.location.href = '/search-view';");
    } else {
        // 如果主窗口不存在，创建新窗口
        // 创建窗口时不指定位置，让系统决定
        let _ = tauri::WebviewWindowBuilder::new(
            app,
            "search-view",
            tauri::WebviewUrl::App("/search-view".into()),
        )
        .title("Fruit Saladict - 搜索")
        .inner_size(420.0, 680.0)
        .min_inner_size(360.0, 520.0)
        .decorations(false)
        .visible(true)
        .build();
    }
}

// 显示配置页面
fn show_config_page(app: &AppHandle) {
    // 尝试获取主窗口
    if let Some(window) = app.get_webview_window("config-view") {
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.unminimize();
        // 导航到配置页面
        // let _ = window.eval("window.location.href = '/config';");
    } else {
        // 如果主窗口不存在，创建新窗口
        let _ = tauri::WebviewWindowBuilder::new(
            app,
            "config-view",
            tauri::WebviewUrl::App("/configs".into()),
        )
        .title("Fruit Saladict - 配置")
        .inner_size(900.0, 700.0)
        .min_inner_size(500.0, 400.0)
        .visible(true)
        .build();
    }
}
