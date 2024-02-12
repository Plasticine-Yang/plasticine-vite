import { platform } from 'os'
import { normalize } from 'path/posix'

const isWindows = platform() === 'win32'

/**
 * 标准化处理路径，会将路径中的 `..` 和 `.` 移除，并移除多余的斜杠
 *
 * @example
 *
 * normalizePath('/foo//bar/baz/..') // /foo/bar
 * normalizePath('C:\\foo\\\\bar\\baz\\..') // C:\foo\\bar\baz\..
 */
export function normalizePath(path: string): string {
  return normalize(isWindows ? replaceBackslash(path) : path)
}

function replaceBackslash(path: string) {
  return path.replace(/\\/g, '/')
}
