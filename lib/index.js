const API = require('./api')
const LongpoolController = require('./controllers/LongpoolController')

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

  /**
   * Starts pooling
   */
  async startPooling () {
    try {
      let server = await this.api.messages.getLongPollServer({
        lp_version: 2,
        need_pts: false
      })

      this.longpool = new LongpoolController(this.api, server)
      this.longpool.start()
    } catch (err) {
      console.log(err)
    }
  }

  stopPooling () {
    this.longpool.stop()
  }

  on (type, callback) {
    if (this.longpool) {
      switch (type) {
        case 'message': {
          this.longpool.subscribe(type, callback)
          break
        }
      }
    }
  }
}

module.exports = Next
