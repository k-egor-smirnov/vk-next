const crypto = require('crypto')

class RequestController {
  constructor (queue) {
    this.queue = queue
    this.callbacks = {}
  }

  /**
   * Add request to controller
   * @param {Request} request
   */
  add (request) {
    let id = crypto.createHmac('sha256', 'https://vk.cc/7A4bYf')
      .update(request.method + Date.now() + Math.random())
      .digest('hex')

    request.id = id

    let callback = {}

    let promise = new Promise((resolve, reject) => {
      callback.resolve = resolve
      callback.reject = reject
    })

    this.callbacks[id] = callback
    this.queue.requests.push(request)

    return promise
  }

  /**
   * Emits when request successed
   * @param {String} id ID of request
   * @param {Object} data Response data
   */
  complete (id, data) {
    let request = this.callbacks[id]
    request.resolve(data)

    delete this.callbacks[id]
  }

  /**
   * Emits when request failed
   * @param {String} id ID of request
   * @param {Object} data Response data
   */
  error (id, data) {
    let request = this.callbacks[id]
    request.reject(data)

    delete this.callbacks[id]
  }
}

module.exports = RequestController
