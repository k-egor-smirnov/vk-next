const API = require('./api')

class Next {
  /**
   * Creates an insance of VK-Next
   * @param {String} token VK API token
   * @param {BaseQueue} queue Queue used for requests
   * @param {Boolean} isGroup Is token recieved by group
   */
  constructor (token, queue, isGroup) {
    this.queue = queue
    this.api = new API(token)

    this.queue.token = token
    this.queue.isGroup = isGroup

    this.queue.start()
    this.api.init(this.queue)
  }
}

module.exports = Next
