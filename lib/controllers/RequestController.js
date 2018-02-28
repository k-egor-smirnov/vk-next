const crypto = require('nanoid')

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
    request.id = crypto()

    const callbacks = {}

    const promise = new Promise((resolve, reject) => {
      callbacks.resolve = resolve
      callbacks.reject = reject
    })

    this.callbacks[request.id] = callbacks
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
