const { readdirSync } = require('fs')
const { resolve } = require('path')

const scopePaths = ['packages', 'apps']
const packages = scopePaths.reduce((result, scopePath) => {
  const scopes = readdirSync(resolve(__dirname, scopePath))

  return result.concat(scopes)
}, [])

/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
  prompt: {
    scopes: [...packages],
  },
}
