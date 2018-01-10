module.exports = function (module) {
  let methods = {}

  for (let methodName of Object.keys(module)) {
    let method = module[methodName].bind(this)
    methods[methodName] = method
  }

  return methods
}
