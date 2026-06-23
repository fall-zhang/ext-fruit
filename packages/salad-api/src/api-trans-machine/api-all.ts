import * as baiduAtom from './baidu/api-atom'

import * as caiyunAtom from './caiyun/api-atom'

import * as googleAtom from './google/api-atom'

import * as hjdictAtom from './hjdict/api-atom'

import * as youdaotransAtom from './youdaotrans/api-atom'

export const baidu = {
  getRequest: baiduAtom.getFetchRequest,
  handleResponse: baiduAtom.handleResponse,
}
export const caiyun = {
  getRequest: caiyunAtom.getFetchRequest,
  handleResponse: caiyunAtom.handleResponse,
}
export const google = {
  getRequest: googleAtom.getFetchRequest,
  handleResponse: googleAtom.handleResponse,
}
export const hjdict = {
  getRequest: hjdictAtom.getFetchRequest,
  handleResponse: hjdictAtom.handleResponse,
}
export const youdaotrans = {
  getRequest: youdaotransAtom.getFetchRequest,
  handleResponse: youdaotransAtom.handleResponse,
}
