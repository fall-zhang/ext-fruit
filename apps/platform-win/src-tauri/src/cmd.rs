use tauri_plugin_http::reqwest;

#[tauri::command(async)]
pub async fn suggest_req(url: String) -> std::string::String {
    println!("开始请求...");

    // 使用 reqwest 发送GET请求到百度
    match reqwest::get(url).await {
        Ok(response) => {
            println!("百度请求成功，状态码: {}", response.status());

            // 读取响应体文本
            match response.text().await {
                Ok(body_text) => {
                    println!("百度返回内容长度: {} 字节", body_text.len());
                    println!(
                        "百度返回内容前200字符: {}",
                        &body_text[..body_text.len().min(200)]
                    );
                    body_text
                }
                Err(_e) => {
                    // eprintln!("读取百度响应体失败: {}", e);
                    let default_val: String = String::new();
                    default_val
                }
            }
        }
        Err(e) => {
            eprintln!("请求失败: {}", e);
            let default_val: String = String::new();
            default_val
        }
    }
}
