const RequestController = require('../controllers/RequestController')
const request = require('../utils/request')

class BaseQueue {
  /**
   * @param {Boolean} isGroup Is token recieved for group
   */
  constructor () {
    this.controller = new RequestController(this)
  }

  get token () {
    return this._token
  }

  set token (token) {
    this._token = token
  }

  get isGroup () {
    return this._isGroup
  }

  set isGroup (isGroup) {
    this._isGroup = isGroup
  }

  /**
   * Add request to queue
   */
  add () {
    throw new Error('Not implemented')
  }

  /**
   * Start processing queue
   */
  start () {
    throw new Error('Not implemented')
  }

  /**
   * Stop processing queue
   */
  stop () {
    throw new Error('Not implemented')
  }

  /**
   * Get chunk
   */
  _getChunk () {
    throw new Error('Not implemented')
  }

  /**
   * Process a chunk
   * @param {Object} chunk Array of requests
   */
  async _process (chunk) {
    let requests = []
    chunk.map(request => {
      requests.push(request.buildString())
    })

    let code = `return([${requests}]);`

    if (requests.length > 0) {
      let executeResponse = await request('execute', {
        code
      }, this.token)

      let parsedResponse = JSON.parse(executeResponse)

      if (parsedResponse['error']) {
        throw new Error(parsedResponse['error']['error_msg'])
      }

      let responses = parsedResponse['response']
      let errors = parsedResponse['execute_errors']
      let errorResponses = []

      for (let i in responses) {
        let response = responses[i]
        if (response === false) {
          errorResponses.push(chunk[i].id)
        } else {
          this.controller.complete(chunk[i].id, response)
        }
      }

      for (let i in errors) {
        let error = errors[i]

        this.controller.error(errorResponses[i], error)
      }
    }
  }
}

module.exports = BaseQueue
