/** Bypass http restriction */
function youdaoTranslateAjax (request: any): Promise<any> {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const data = xhr.status === 200 ? xhr.responseText : null
        resolve({
          response: data,
          index: request.index,
        })
      }
    }
    xhr.open(request.type, request.url, true)

    if (request.type === 'POST') {
      xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
      xhr.send(request.data)
    } else {
      xhr.send(null as any)
    }
  })
}
