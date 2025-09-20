import { AppConfig } from '../store/config/get-default-conf'

/**
 * 是否被暂时禁用
 * @returns {boolean}
 */
export function isTempDisable (config:AppConfig):boolean {
  return config.blacklist.some(([r]) => new RegExp(r).test(location.href)) &&
      config.whitelist.every(([r]) => !new RegExp(r).test(location.href))
}
