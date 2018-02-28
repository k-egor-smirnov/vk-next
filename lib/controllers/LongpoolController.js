const request = require('request-promise')
const parse = require('../utils/parseLongpollResponse')

/**
 * Creates controller for LongPoll
 */
class LongpollController {
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
   * Call LongPoll server for recieve new updates
   */
  async _call () {
    if (this.started) {
      const { server, key, ts } = this

      const { timestamp, updates } = JSON.parse(await request({
        uri: server,
        qs: {
          key,
          ts,
          wait: 25,
          act: 'a_check',
          mode: 2,
          version: 2
        }
      }))

      this.ts = response.ts

      const events = parse(response.updates)

      this.callbacks.map(callback => {
        events.map(event => {
          if (callback.type === event.type) {
            this.store.process(event.data, callback)
          }
        })
      })

      this._call()
    }
  }
}

module.exports = LongpollController
