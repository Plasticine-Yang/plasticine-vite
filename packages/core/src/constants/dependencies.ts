/** 匹配第三方依赖包名的 RegExp，即非相对路径导入，只要是字母或 @ 开头，且不带有 `:` 的虚拟模块，就可以视为第三方依赖包 */
export const DEPENDENCY_PACKAGE_RE = /^[\w@][^:]/
