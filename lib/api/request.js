const request = require('request-promise')
const qs = require('querystring')

/**
 * Module that calls VK API
 * @param {String} method Method to call
 * @param {Object} params Method's params
 * @param {String} [v=5.69] API version
 * @param {String} [access_token=this.token]
 * @this API API instance
 */
module.exports = function (
  method,
  params = [],
  v = '5.69',
  access_token = this.token
) {
  const options = {
    uri: `https://api.vk.com/method/${method}`,
    qs: {
      access_token,
      v,
      params: qs.stringify(params)
    }
  }

  return request(options)
}
