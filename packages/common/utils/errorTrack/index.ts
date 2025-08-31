// 获取设备信息等内容，统一提交给后端

export const errorReporter = () => {
  // console.error(errorInfo)
  window.addEventListener('error', (ev) => {
    console.log('🚀 ~ window.addEventListener ~ ev:', ev)
  })
  window.addEventListener('error', (e) => {
    const trackInfo = {
      programName: 'LESS-PROCESS',
      pageName: location.hash, // 页面，模块名称
      url: location.href, // 页面，应用 URL
      timeStamp: new Date().getTime(), // 错误的时间戳
      deviceInfo: {
        userAgent: 'Chrome', // 用户浏览器类型
        browserVersion: '110', // 用户浏览器版本
        system: 'windows'
      }, // 用户浏览器类型
      message: e.message, // 错误详细信息
      loadedTime: 'string', // 本次应用运行时间
      filename: 'string', //  'http://localhost:8080/examples.js' 访问的文件名
      selector: 'string', // 'HTML BODY #container .content INPUT' // 选择器
      type: '', // 'error' |'warn' |'performance' // 类型，包括 error, warn, performance
      subType: 'string', // 'jsError' // 错误类型
      position: `${e.lineno}:${e.colno}`, // '0:0' // 行:列信息
      errorStack: e.error
    }
    new Date().getTime()
    console.log(e)
    e.colno
    e.lineno

    // loadedTime : e.timeStamp
  })
  // fetch('192.168.100.154')
}

export const errorHandler = (errorInfo:Error) => {
  console.log('🚀 ~ errorHandler ~ errorInfo:', errorInfo.stack)
  console.log('🚀 ~ errorHandler ~ errorInfo:', errorInfo.cause)
  console.log('🚀 ~ errorHandler ~ errorInfo:', errorInfo.message)
}
