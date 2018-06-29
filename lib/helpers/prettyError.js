module.exports = (err, options) => {
  let str = ''

  let prefix = '\x1b[41mUnknown error'

  if (options.type === 'API') prefix = "\x1b[41m API error "

  const requestedParams = err.request_params.map(param => {
    return `\n${param.key}: ${param.value}`
  })

  str += `${prefix}\t\x1b[0m\x1b[31m${err.error_msg}\n\n\x1b[32m\x1b[4mRequested params:\n\x1b[0m${requestedParams}\n\n`

  console.log(str)
}