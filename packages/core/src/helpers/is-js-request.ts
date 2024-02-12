import path from 'path'

import { JS_TYPES_RE } from '@/constants'

import { cleanUrl } from './clean-url'

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
