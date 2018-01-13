const fs = require('fs')
const mkdirp = require('mkdirp')
const refParser = require('json-schema-ref-parser')
const path = require('path')
const codeGenerate = require('./utils/codeGenerate')
const replaceAt = require('./utils/replaceAt')

function getSchemas () {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, './vk-api-schema'), (err, files) => {
      if (err) reject(err)

      let schemas = files.filter(filename => {
        return filename.endsWith('.json') && filename !== 'composer.json'
      })

      resolve(schemas)
    })
  })
}

async function parseSchemas (filenames) {
  let schemas = {}

  for (let filename of filenames) {
    console.log(`Processing ${filename}`)

    let schema = await refParser.dereference(
      path.join(__dirname, `./vk-api-schema/${filename}`)
    )

    let title = filename.split('.')[0]
    schemas[title] = schema
  }

  console.log('Process completed')

  return schemas
}

function generateDir (
  apiPath = path.join(__dirname, '..', 'lib', 'api', 'methods')
) {
  return new Promise((resolve, reject) => {
    mkdirp(apiPath, err => {
      if (err) throw err
      resolve(apiPath)
    })
  })
}

;(async () => {
  let filenames = await getSchemas()
  let schemas = await parseSchemas(filenames)
  let apiPath = await generateDir()
  // let API = require('./api/index')
  // let api = new API('123')
  // await api.init()
  // console.log(api.users.get())
  let categories = {}

  schemas['methods']['methods'].map(methodObject => {
    let category = methodObject.name.split('.')[0]
    let method = methodObject.name.split('.')[1]
    if (!categories[category]) categories[category] = {}
    categories[category][method] = methodObject
  })

  for (let category of Object.keys(categories)) {
    let code = codeGenerate.generate(categories[category])

    fs.writeFile(
      path.join(
        apiPath,
        replaceAt(category, 0, category[0].toUpperCase()) + '.js'
      ),
      code,
      err => {
        if (err) console.log(err)

        console.log(
          replaceAt(category, 0, category[0].toUpperCase()) + '.js generated'
        )
      }
    )
  }

  let apiClassCode = codeGenerate.generateAPIClass(categories)

  fs.writeFile(path.join(apiPath, '..', 'index.js'), apiClassCode, err => {
    if (err) console.log(err)

    console.log('index.js generated')
  })
})()
