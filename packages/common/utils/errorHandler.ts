
const isDevMode = import.meta.env.MODE === 'development'
const errorHandler = (error: unknown) => {
  // 将错误信息上报到服务器
  // postError({
  //   error: error as Error,
  //   isDevMode,
  //   url: window.location.href
  // })
  if (isDevMode) {
    console.log('errorHandler', error)
  }
}
