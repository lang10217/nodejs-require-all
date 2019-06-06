const fs = require('fs')
/**
 *
 * @param {Object} options recursive:是否递归，如果不递归只搜索一层；
 */
function requireAll(dirname, options) {
  if (!dirname) {
    throw new Error('dirname is necessary')
  }
  if (typeof dirname !== 'string') {
    throw new Error('dirname must be a string')
  }
  if (!options) {
    options = {}
  }
  let rootDirname = dirname
  if (rootDirname.substr(-1, 1) !== '/') {
    rootDirname += '/'
  }
  // console.log('rootDirname:', rootDirname)
  let result = {}
  readDir(rootDirname, '', result, options)
  // console.log('result:', result)
  return result
}
/**
 * 读取不分层的对象
 * @param {String} rootDirname
 * @param {String} currentDirname
 * @param {Object} result
 * @param {Object} options
 */
function readDir(rootDirname, currentDirname, result, options) {
  let files = fs.readdirSync(rootDirname + currentDirname, { withFileTypes: true })
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.isDirectory()) {
      if (options.recursive) {
        readDir(rootDirname, currentDirname + file.name + '/', result, options)
      }
    } else if (file.isFile()) {
      let propertyName = currentDirname + file.name.replace(/(.js)|(.jsx)/, '')
      let fileName = rootDirname + currentDirname + file.name
      result[propertyName] = require(fileName)
    }
  }
}

module.exports = requireAll
