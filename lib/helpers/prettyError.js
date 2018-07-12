const prefixes = {
  API: '\x1b[41mAPI error',
  Longpoll: '\x1b[41mLongpoll error',
}

module.exports = (err, options) => {
  let prefix = prefixes[options.type] || '\x1b[41mUnknown error';
  
  let str = `${prefix}\t\x1b[0m\x1b[31m${err.error_msg}`;
  
  if (options.type === 'API') {
    const requestedParams = err.request_params.map(param => {
      return `\n${param.key}: ${param.value}`
    })
  
    str += `\n\n\x1b[32m\x1b[4mRequested params:\n\x1b[0m${requestedParams}\n\n`
    
  } 

  return console.log(str + '\x1b[0m')
}