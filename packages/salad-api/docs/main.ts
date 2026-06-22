import { getFetchRequest, handleResponse } from '../src/api-trans/bing/api-atom'

const reqInfo = {
  text: 'filter',
  from: 'en',
  to: 'zh',
} as const

const req = getFetchRequest(reqInfo.text, reqInfo)

fetch(req).then(res => {
  return handleResponse(res, reqInfo)
}).then(res => {
  console.log('⚡️ line:10 ~ res: ', res)
}).catch(err => {
  console.warn(err)
})
