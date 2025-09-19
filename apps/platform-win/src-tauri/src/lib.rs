use std::sync::Mutex;
use tauri::async_runtime::spawn;
use tauri::{AppHandle, Manager, State};
use tokio::time::{sleep, Duration};

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

enum FileOperateState {
    Remove,
    Add,
    Modify,
}

struct SetupState {
    frontend_task: bool,
    backend_task: bool,
}

#[derive(Default)]
struct MyState {
    // "add",
    s: std::sync::Mutex<String>,
    t: std::sync::Mutex<std::collections::HashMap<String, String>>,
}
// remember to call `.manage(MyState::default())`
#[tauri::command]
async fn file_operate(state: tauri::State<'_, MyState>) -> Result<(), String> {
    *state.s.lock().unwrap() = "new string".into();
    state.t.lock().unwrap().insert("key".into(), "value".into());
    Ok(())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(SetupState {
            frontend_task: false,
            backend_task: false,
        }))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        // .invoke_handler(tauri::generate_handler![greet, set_complete])
        .invoke_handler(tauri::generate_handler![file_operate])
        // .setup(|app| {
        //     // Spawn setup as a non-blocking task so the windows can be
        //     // created and ran while it executes
        //     spawn(setup(app.handle().clone()));
        //     // The hook expects an Ok result
        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn set_complete(
    app: AppHandle,
    state: State<'_, Mutex<SetupState>>,
    task: String,
) -> Result<(), ()> {
    // Lock the state without write access
    let mut state_lock = state.lock().unwrap();
    match task.as_str() {
        "frontend" => state_lock.frontend_task = true,
        "backend" => state_lock.backend_task = true,
        _ => panic!("invalid task completed!"),
    }
    // Check if both tasks are completed
    if state_lock.backend_task && state_lock.frontend_task {
        // Setup is complete, we can close the splashscreen
        // and unhide the main window!
        println!("YYYYYYYYYYY your window will close!");

        let splash_window = app.get_webview_window("splash-screen").unwrap();
        let main_window = app.get_webview_window("main-page").unwrap();
        splash_window.close().unwrap();
        main_window.show().unwrap();
    }
    Ok(())
}
#[tauri::command]
fn greet(name: String) -> String {
    // format!("Hello {name} from Rust!");
    println!("Hello, {}! You've been running greet in Rust!", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// An async function that does some heavy setup task
async fn setup(app: AppHandle) -> Result<(), ()> {
    // Fake performing some heavy action for 3 seconds
    println!("Performing really heavy backend setup task...");
    // sleep(Duration::from_secs(3)).await;
    println!("Backend setup task completed!");
    // Set the backend task as being completed
    // Commands can be ran as regular functions as long as you take
    // care of the input arguments yourself
    set_complete(
        app.clone(),
        app.state::<Mutex<SetupState>>(),
        "backend".to_string(),
    )
    .await?;
    Ok(())
}
