/**
 * 将路径字符串解析为属性键数组
 * 支持: 'a.b.c', 'a[0].b', 'a[0][1]', 'a.b[0]'
 */
function parsePath (path: string): (string | number)[] {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .map((key) => (/^\d+$/.test(key) ? Number(key) : key))
}

/**
 * 从对象中安全地获取嵌套属性值
 * @param obj - 目标对象
 * @param path - 属性路径（支持 'a.b.c' 或 ['a', 'b', 'c']）
 * @param defaultValue - 默认值（当路径不存在时返回）
 * @returns 获取到的值或默认值
 *
 * @example
 * get({ a: { b: { c: 3 } } }, 'a.b.c') // 3
 * get({ a: { b: { c: 3 } } }, 'a.b.d', 'default') // 'default'
 * get({ arr: [1, 2, 3] }, 'arr[1]') // 2
 */
export function get<T = unknown> (
  obj: unknown,
  path: string | (string | number)[],
  defaultValue?: T
): T | undefined {
  if (obj == null) {
    return defaultValue
  }

  const keys = typeof path === 'string' ? parsePath(path) : path
  let result: unknown = obj

  for (const key of keys) {
    // 使用 ES2025 可选链操作符
    result = result?.[key as keyof typeof result]
  }

  return (result ?? defaultValue) as T | undefined
}

/**
 * 安全地设置对象中嵌套属性的值
 * @param obj - 目标对象
 * @param path - 属性路径（支持 'a.b.c' 或 ['a', 'b', 'c']）
 * @param value - 要设置的值
 * @returns 修改后的对象
 *
 * @example
 * const obj = { a: { b: {} } };
 * set(obj, 'a.b.c', 3); // { a: { b: { c: 3 } } }
 * set({}, 'arr[0].name', 'test'); // { arr: [{ name: 'test' }] }
 */
export function set<T extends object> (
  obj: T,
  path: string | (string | number)[],
  value: unknown
): T {
  const keys = typeof path === 'string' ? parsePath(path) : path
  let current: Record<string | number, unknown> = obj as any

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    const nextKey = keys[i + 1]!

    // 使用 ES2025 可选绑定赋值
    current[key] ??= typeof nextKey === 'number' ? [] : {}

    current = current[key] as Record<string | number, unknown>
  }

  const lastKey = keys[keys.length - 1]!
  current[lastKey] = value

  return obj
}
