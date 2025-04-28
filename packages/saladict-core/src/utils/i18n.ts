

class Translator {
  globalContext
  data = {
    values: {},
    contexts: []
  }

  constructor () {
    this.data = {
      values: {},
      contexts: []
    }
    this.globalContext = {}
  }

  translate (text, defaultNumOrFormatting, numOrFormattingOrContext, formattingOrContext, context) {
    let defaultText, formatting, num

    if (context == null) {
      context = this.globalContext
    }
    const isObject = (obj) => {
      let type

      type = typeof obj
      return type === 'function' || type === 'object' && !!obj
    }
    if (isObject(defaultNumOrFormatting)) {
      defaultText = null
      num = null
      formatting = defaultNumOrFormatting
      context = numOrFormattingOrContext || this.globalContext
    } else {
      if (typeof defaultNumOrFormatting === 'number') {
        defaultText = null
        num = defaultNumOrFormatting
        formatting = numOrFormattingOrContext
        context = formattingOrContext || this.globalContext
      } else {
        defaultText = defaultNumOrFormatting
        if (typeof numOrFormattingOrContext === 'number') {
          num = numOrFormattingOrContext
          formatting = formattingOrContext
          context = context
        } else {
          num = null
          formatting = numOrFormattingOrContext
          context = formattingOrContext || this.globalContext
        }
      }
    }
    if (isObject(text)) {
      if (isObject(text.i18n)) {
        text = text.i18n
      }
      return this.translateHash(text, context)
    }
    return this.translateText(text, num, formatting, context, defaultText)
  }

  add (d) {
    let c, k, v, _i, _len, _ref, _ref1, _results

    if ((d.values != null)) {
      _ref = d.values
      for (k in _ref) {
        v = _ref[k]
        this.data.values[k] = v
      }
    }
    if ((d.contexts != null)) {
      _ref1 = d.contexts
      _results = []
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i]
        _results.push(this.data.contexts.push(c))
      }
      return _results
    }
  }

  setContext (key, value) {
    return this.globalContext[key] = value
  }

  clearContext (key) {
    return this.lobalContext[key] = null
  }

  reset () {
    this.data = {
      values: {},
      contexts: []
    }
    this.globalContext = {}
    return this.globalContext
  }

  resetData () {
    this.data = {
      values: {},
      contexts: []
    }
    return this.data
  }

  resetContext () {
    this.globalContext = {}
    return this.globalContext
  }

  translateHash (hash, context) {
    let k, v

    for (k in hash) {
      v = hash[k]
      if (typeof v === 'string') {
        hash[k] = this.translateText(v, null, null, context)
      }
    }
    return hash
  }

  translateText (text, num, formatting, context, defaultText) {
    let contextData, result

    if (context == null) {
      context = this.globalContext
    }
    if (this.data == null) {
      return this.useOriginalText(defaultText || text, num, formatting)
    }
    contextData = this.getContextData(this.data, context)
    if (contextData != null) {
      result = this.findTranslation(text, num, formatting, contextData.values, defaultText)
    }
    if (result == null) {
      result = this.findTranslation(text, num, formatting, this.data.values, defaultText)
    }
    if (result == null) {
      return this.useOriginalText(defaultText || text, num, formatting)
    }
    return result
  }

  findTranslation (text, num, formatting, data) {
    let result, triple, _i, _len

    const value = data[text]
    if (value == null) {
      return null
    }
    if (num == null) {
      if (typeof value === 'string') {
        return this.applyFormatting(value, num, formatting)
      }
    } else {
      if (value instanceof Array || value.length) {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          triple = value[_i]
          if ((num >= triple[0] || triple[0] === null) && (num <= triple[1] || triple[1] === null)) {
            result = this.applyFormatting(triple[2].replace('-%n', String(-num)), num, formatting)
            return this.applyFormatting(result.replace('%n', String(num)), num, formatting)
          }
        }
      }
    }
    return null
  }

  getContextData (data, context) {
    let c, equal, key, value, _i, _len, _ref, _ref1

    if (data.contexts == null) {
      return null
    }
    _ref = data.contexts
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i]
      equal = true
      _ref1 = c.matches
      for (key in _ref1) {
        value = _ref1[key]
        equal = equal && value === context[key]
      }
      if (equal) {
        return c
      }
    }
    return null
  }

  useOriginalText (text, num, formatting) {
    if (num == null) {
      return this.applyFormatting(text, num, formatting)
    }
    return this.applyFormatting(text.replace('%n', String(num)), num, formatting)
  }

  applyFormatting (text, num, formatting) {
    let ind, regex

    for (ind in formatting) {
      regex = new RegExp('%{' + ind + '}', 'g')
      text = text.replace(regex, formatting[ind])
    }
    return text
  }
}

const translator = new Translator()

const i18n = {
  ...translator.translate,
  translator,
  create (data) {
    const trans = new Translator()
    if (data != null) {
      trans.add(data)
    }
    trans.translate.create = i18n.create
    return trans.translate
  }
}

export { i18n }
