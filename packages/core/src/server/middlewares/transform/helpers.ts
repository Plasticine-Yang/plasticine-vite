import path from 'path'

import { HASH_RE, JS_TYPES_RE, QUERY_RE } from './constants'

/** 去除 url 的 search params 和 hash value */
export function cleanUrl(url: string): string {
  return url.replace(HASH_RE, '').replace(QUERY_RE, '')
}

export function isJSRequest(url: string): boolean {
  url = cleanUrl(url)

  if (JS_TYPES_RE.test(url)) {
    return true
  }

  if (!path.extname(url) && !url.endsWith('/')) {
    return true
  }

  return false
}
