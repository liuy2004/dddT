'use strict'

import {restConfig} from "./config.js";

const prefixUri = restConfig.prefixUri
const enumValue = (name, option) => Object.freeze({
  get: option.get,
  post: option.post,
  put: option.put,
  patch: option.patch,
  delete: option.delete,
  toString: () => name
})
const objToUrl = (param, includeQ) => {
  if (!param || param.length === 0) {
    return ''
  }
  let params = []
  for (const key of Object.keys(param)) {
    params.push(`${key}=${encodeURI(param[key])}`)
  }
  return (includeQ ? '?' : '') + params.join('&')
}
const HttpType = Object.freeze({
  AXIOS: enumValue("HttpType.AXIOS", {
    get: (_http, url, param) => {
      return _http.get(url + objToUrl(param, url.indexOf('?') === -1))
    },
    post: (_http, url, param) => {
      return _http.post(url, param)
    }
  }),
});

class RestApi {
  _http
  _httpType

  constructor(_httpType, _http) {
    this._httpType = _httpType
    this._http = _http
  }

  /**
   * 获取指令提示
   * @param command 当前已经输入的命令
   * @returns {*}
   */
  remindCommand(command) {
    return this._httpType.get(this._http, prefixUri + '/remindCommand', {
      command: command
    })
  }

  /**
   * 执行指令
   * @param command 需要执行的命令
   * @returns {*}
   */
  execute(command) {
    return this._httpType.post(this._http, prefixUri + '/execute', {
      command: command
    })
  }
}

export {HttpType, RestApi}