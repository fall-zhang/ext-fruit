# OpenTranslate

This package folk from https://github.com/allentown521/OpenTranslate


## Usage

```
import Aliyun from '@opentranslate/aliyun'

//Please refer to https://help.aliyun.com/zh/machine-translation/developer-reference/api-reference-machine-translation-universal-version-call-guide?spm=5176.15007269.console-base_help.dexternal.1afe5d78DUvEPh
const aliyun = new Aliyun({
    config: {
        appid: "",
        key: ""
    }
})

aliyun.translate('text').then(console.log)
```