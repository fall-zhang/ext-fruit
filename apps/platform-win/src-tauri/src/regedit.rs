// 注册应用的后缀名

use winreg::enums::*;
use winreg::RegKey;

// fn main() {
//     let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
//     let software = hklm.open_subkey_with_flags("SOFTWARE", KEY_WRITE).unwrap();
//     let my_app = software.create_subkey("MyApp").unwrap();
//     my_app.set_value("Version", &"1.0").unwrap();
// }

fn main() {
    let hklm = RegKey::predef(HKEY_CLASSES_ROOT);
    let file_ext = ".md";

    // 创建文件扩展名关联
    hklm.create_subkey(&format!("{}\\shell\\open\\command", file_ext))
        .unwrap()
        .set_value("", &"path_to_your_app.exe %1")
        .unwrap();

    // 设置关联的应用程序
    hklm.create_subkey(&format!("{}\\DefaultIcon", file_ext))
        .unwrap()
        .set_value("", &"path_to_your_app_icon.ico")
        .unwrap();

    // 设置文件类型描述
    hklm.create_subkey(&format!("{}\\", file_ext))
        .unwrap()
        .set_value("", &"MyApp File")
        .unwrap();
}
