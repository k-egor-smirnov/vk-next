module.exports = function (module) {
  const methods = {}

  for (const methodName of Object.keys(module)) {
    const method = module[methodName].bind(this)
    methods[methodName] = method
  }

  return methods
}
