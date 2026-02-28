# OpenTranslate

This package folk from https://github.com/allentown521/OpenTranslate

列出所有可用的翻译 API，并且进行统一格式的包装

## Usage

```
import Aliyun from '@opentranslate/aliyun'

//Please refer to https://help.aliyun.com/zh/machine-translation/developer-reference/api-reference-machine-translation-universal-version-call-guide
const aliyun = new Aliyun({
    config: {
        appid: "",
        key: ""
    }
})

aliyun.translate('text').then(console.log)
```