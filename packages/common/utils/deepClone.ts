export const deepClone = (obj:any):any => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => {
      return deepClone(item)
    })
  }

  const clonedObj:Record<string, any> = {}
  for (const key in obj) {
    if (obj[key]) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  return clonedObj
}
