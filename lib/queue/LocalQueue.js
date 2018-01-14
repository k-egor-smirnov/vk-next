const BaseQueue = require('./BaseQueue')
const Request = require('../models/Request')

class LocalQueue extends BaseQueue {
  constructor () {
    super()

    this.requests = []
  }

  add (method, params) {
    let promise = this.controller.add(new Request(method, params))

    return promise
  }

  start () {
    this.interval = setInterval(() => {
      let chunk = this._getChunk()
      this._process(chunk)
    }, 1000 / this.isGroup ? 20 : 3)
  }

  stop () {
    if (this.interval) clearInterval(this.interval)
  }
}

module.exports = LocalQueue
