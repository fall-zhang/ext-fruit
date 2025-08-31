// 深度内容的合并，用于多个配置时进行合并
export function mergeList<T> (...args:T[]):T {
  const obj = {
    ...args[0]
  }
  return obj
}

type DeepRecord = Record<string, unknown>
export function merge (...args:DeepRecord[]):DeepRecord {
  let result:DeepRecord = { }
  args.forEach(item => {
    result = {
      ...result,
      item
    }
  })
  const obj = {
    ...args[0]
  }
  return obj
}

type UnknownObj = Record<string, unknown>

/**
 * 将两个对象的属性进行合并，后者覆盖前者
 */
export function deepMerge (a:UnknownObj, b:UnknownObj):UnknownObj {
  const result:UnknownObj = {
    ...a
  }
  if (a && b) {
    for (const key in b) {
      if (typeof b[key] === 'object' && b[key]) {
        if (typeof a[key] !== 'object') {
          result[key] = b[key] as UnknownObj
        } else {
          const newA:UnknownObj = (a[key] || { }) as UnknownObj
          const newObj = deepMerge(newA, b[key] as UnknownObj)
          result[key] = newObj
        }
      } else {
        result[key] = b[key]
      }
    }
  }

  return result
};
