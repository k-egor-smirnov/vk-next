const request = require('request-promise')

/**
 * Creates controller for LongPoll
 */
class BotLongpollController {
  constructor (api, store, { key, server, ts }) {
    this.api = api
    this.store = store
    this.key = key
    this.server = server
    this.ts = ts
    this.callbacks = []
  }

  start () {
    this.started = true
    this._call()
  }

  stop () {
    this.started = false
  }

  /**
   *
   * @param {String} type Type of update to recieve
   * @param {Function} callback Function to recieve data
   */
  subscribe (type, callback) {
    this.callbacks.push({ type, callback })
  }

  /**
   * Call Bot LongPoll server for recieve new updates
   */
  async _call () {
     if (this.started) {
      const { server, key, ts } = this
      const response = await request({
        uri: server,
        qs: {
          key,
          ts,
          wait: 25,
          act: 'a_check'
        }
      })

      const data = JSON.parse(response)
      const { updates } = data

      this.ts = data.ts
      updates.map(update => { 
        this.callbacks.map(callback => {
          if (callback.type === update.type) {
            this.store.process(update.object, callback)
          }
        })
      })

      this._call()
    }
  }
}

module.exports = BotLongpollController
