const axios = require("axios");
const error = require('../helpers/prettyError')

/**
 * Creates controller for LongPoll
 */
class BotLongpollController {
  constructor(api, store, { key, server, ts }) {
    this.api = api;
    this.store = store;
    this.key = key;
    this.server = server;
    this.ts = ts;
    this.subscribes = [];
  }

  start() {
    this.started = true;
    this._call();
  }

  stop() {
    this.started = false;
  }

  /**
   *
   * @param {String} type Type of update to recieve
   * @param {Function} callback Function to recieve data
   */
  subscribe(type, callback) {
    this.subscribes.push({ type, callback });
  }

  /**
   * Call Bot LongPoll server for recieve new updates
   */
  async _call() {
    if (this.started) {
      const { server, key, ts } = this;

      const { data } = await axios.get(server, {
        params: {
          key,
          ts,
          wait: 25,
          act: "a_check"
        }
      });

      const { updates } = data;

      this.ts = data.ts;
      updates.map(update => {
        const callback = this.subscribes.find(callback => {
          if (callback.type === update.type) {
            return true
          }
        });

        if (callback) {
          this.store.process(update.object, callback);
        } else {
          error({
            error_msg: `Can't find handler for "${update.type}" callback type`
          },  { type: "Longpoll"})
        }
      });

      this._call();
    }
  }
}

module.exports = BotLongpollController;
