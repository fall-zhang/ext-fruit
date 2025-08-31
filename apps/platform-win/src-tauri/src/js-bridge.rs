// 负责与 js 的交互
// 包括读取文件，保存文件，文件状态变更

// 在 Rust 中调用 JavaScript 函数
fn main() {
    tauri::AppBuilder::new()
        .invoke_handler(|_webview, arg| {
            // 传入的参数
            let message: String = arg.into();

            // 调用 JavaScript 函数
            tauri::execute_promise(_webview, move |_webview, _payload| {
                // JavaScript 函数的名称和参数
                let js_code = format!("window.postMessage({{ message: '{}' }})", message);

                // 执行 JavaScript 函数
                _webview.eval(&js_code)
            });

            Ok(())
        })
        .run();
}

// 在 JavaScript 中监听消息
// window.addEventListener('message', (event) => {
//     // 接收传入的信息
//     const message = event.data.message;
    
//     // 处理传入的信息
//     console.log(message);
// });