const request = require('request-promise')
const parse = require('../utils/parseLongpoolResponse')

/**
 * Creates controller for LongPool
 */
class LongpoolController {
  constructor (api, { key, server, ts }) {
    this.api = api
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
   * Call LongPool server for recieve new updates
   */
  async _call () {
    if (this.started) {
      let options = {
        uri: `https://${this.server}?act=a_check&key=${this.key}&ts=${this.ts}&wait=25&mode=2&version=2`
      }

      let response = JSON.parse(await request(options))

      this.ts = response.ts

      let events = parse(response.updates)

      this.callbacks.map(callback => {
        events.map(event => {
          if (callback.type === event.type) {
            callback.callback(event.data)
          }
        })
      })

      this._call()
    }
  }
}

module.exports = LongpoolController
