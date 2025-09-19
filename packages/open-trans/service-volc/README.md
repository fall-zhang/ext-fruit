# @opentranslate/volc

[![npm-version](https://img.shields.io/npm/v/@opentranslate/volc.svg)](https://www.npmjs.com/package/@opentranslate/volc)
[![OpenTranslate](https://img.shields.io/badge/OpenTranslate-Compatible-brightgreen)](https://github.com/OpenTranslate)

volc translator with [OpenTranslate](https://github.com/OpenTranslate) API.

## Installation

Yarn

```
yarn add @opentranslate/volc
```

NPM

```
npm i @opentranslate/volc
```

## Usage

```
import volc from '@opentranslate/volc'

//Please refer to https://help.volc.com/zh/machine-translation/developer-reference/api-reference-machine-translation-universal-version-call-guide?spm=5176.15007269.console-base_help.dexternal.1afe5d78DUvEPh
const volc = new volc({
    config: {
        appid: "",
        key: ""
    }
})

volc.translate('text').then(console.log)
```

## API

See [translator](https://github.com/OpenTranslate/OpenTranslate/blob/master/packages/translator/README.md) for more details.

## Disclaimer

The material and source code from this package are for study and research purposes only. Any reliance you place on such material or source code are strictly at your own risk.
