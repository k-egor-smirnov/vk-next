const request = require('request-promise')

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
  access_token = this.token, // eslint-disable-line
  v = '5.69'
) {
  const options = {
    uri: `https://api.vk.com/method/${method}`,
    qs: {
      access_token, // eslint-disable-line
      v,
      ...params
    }
  }

  return request(options)
}
