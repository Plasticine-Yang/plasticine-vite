import { HASH_RE, QUERY_RE } from '@/constants'

/** 去除 url 的 search params 和 hash value */
export function cleanUrl(url: string): string {
  return url.replace(HASH_RE, '').replace(QUERY_RE, '')
}
