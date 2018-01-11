const replaceAt = require('../utils/replaceAt')

function generateJSDocs (method) {
  let types = {
    integer: 'Number',
    array: 'Object',
    string: 'String',
    boolean: 'Boolean'
  }

  let code = '/**\n'

  code += ' * ' + method.description + '\n'
  code += ` * @param {Object} data Method's passed data\n`

  if (method.parameters) {
    method.parameters.map(param => {
      code += ` * @param {${types[param.type] || param.type}} data.${param.name} ${param.description}\n`
    })
  }

  if (method.errors) {
    method.errors.map(error => {
      code += ` * @throws {${error.name}} ${error.code} — ${error.description}\n`
    })
  }

  code += ` * @this API Instance of API\n`
  code += ` * @returns {Promise}\n`

  code += ` * @see {@link https://vk.com/dev/${method.name}}\n`

  code += ' */\n'

  return code
}

function generateFunction (methodName, method) {
  let code = ''

  code += generateJSDocs(method)
  code += `module.exports.${methodName} = function (data) {\n` // TODO: Params

  if (method.parameters) {
    // TODO: Typecheck
    // method.parameters.map(param => {
    //   if (param.required) {
    //     let types = {
    //       integer: 'number',
    //       array: 'object'
    //     }
    //     code += tab(
    //       `if (!${param.name} || typeof ${param.name} !== '${types[param.type] || param.type}') throw new Error('${param.name} must be an ${param.type}')\n`,
    //       1
    //     )
    //   }
    // })
  }

  code += tab(`return this._call('${method.name}', data)\n`, 1)
  code += '}\n\n'

  return code
}

// function generateParams (method) {
//   let code = ''

//   if (method.parameters) {
//     method.parameters.map(param => {
//       code += tab(
//         `${param.name}${param.default ? ' = ' + toRightType(param, param.default) : ''},\n`,
//         1
//       )
//     })
//   }

//   return code
// }

function generateImports (categories) {
  let code = ''

  code += "const bindMethods = require('./bindMethods')\n"
  code += "const request = require('./request')\n"

  let categoriesName = Object.keys(categories)
  categoriesName.map(categoryName => {
    code += `const ${categoryName} = require('./methods/${replaceAt(categoryName, 0, categoryName[0].toUpperCase())}')\n`
  })

  return code
}

function generateAPIClass (categories) {
  let code = ''

  code += generateImports(categories)

  // Generate constructor
  code += '\nclass API {\n'
  code += tab('constructor (token) {\n', 1)
  code += tab('this.token = token\n', 2)

  Object.keys(categories).map(category => {
    code += tab(`this.${category} = ${category}\n`, 2)
  })

  code += tab('}\n\n', 1)

  // Generate init
  code += tab('init () {\n', 1)

  code += tab('for (let category of Object.keys(this)) {\n', 2)

  code += tab('if (category !== "token") {\n', 3)

  code += tab('this[category] = bindMethods.call(this, this[category])\n', 4)

  code += tab('}\n', 3)

  code += tab('}\n', 2)

  code += tab('}\n\n', 1)

  // Generate API call
  code += tab('_call (...params) {\n', 1)

  code += tab('return request.call(this, ...params)\n', 2)

  code += tab('}\n', 1)

  code += '}\n\n'

  code += 'module.exports = API\n'

  return code
}

function generate (category) {
  let code = ''

  for (let methodName of Object.keys(category)) {
    code += generateFunction(methodName, category[methodName])
  }

  return code
}

function tab (code, n) {
  return '  '.repeat(n) + code
}

function toRightType (param, string) {
  if (param.type === 'string') return `"${string}"`
  return string
}

module.exports = {
  generate: generate,
  generateAPIClass: generateAPIClass
  // generateClass: generateClass
}
