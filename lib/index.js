const API = require("./api");
const LongpollController = require("./controllers/LongpollController");
const BotLongpollController = require("./controllers/BotLongpollController");
const LocalQueue = require('./queue/LocalQueue')
const Store = require("./stores/LocalStore");
const Keyboard = require('./models/Keyboard')

class Next {
  /**
   * Creates an insance of VK-Next
   * @param {String} token VK API token
   * @param {BaseQueue} queue Queue used for requests
   * @param {Boolean} isGroup Is token recieved by group
   */
  constructor(token, queue, options) {
    this.queue = queue;
    this.api = new API(token)

    this.queue.api = this.api;
    this.queue.isGroup = options.isGroup;

    this.queue.start();

    this.store = new Store(this.api);
  }

  /**
   * Starts polling
   */
  async startPolling() {
    try {
      if (this.queue.isGroup) {
        throw new Error(
          "LongPoll API is not avaible for groups. Use startBotPolling()"
        );
      }

      const server = await this.api.messages.getLongPollServer({
        lp_version: 2,
        need_pts: false
      });

      this.longpoll = new LongpollController(this.api, this.store, server);
      this.longpoll.start();
    } catch (err) {
      throw err;
    }
  }

  /**
   * Start polling for group
   * @param {Number} groupId Group ID
   */
  async startBotPolling(groupId) {
    if (!this.queue.isGroup) {
      throw new Error(
        "Bot LongPoll API is not avaible for users. Use startPolling()"
      );
    }

    try {
      const server = await this.api.groups.getLongPollServer({
        group_id: groupId
      });

      this.longpoll = new BotLongpollController(this.api, this.store, server);
      this.longpoll.start();
    } catch (err) {
      throw err;
    }
  }

  stopPolling() {
    this.longpoll.stop();
  }

  on(type, callback) {
    if (this.longpoll) {
      this.longpoll.subscribe(type, callback);
    } else {
      throw new Error("LongPoll is not initialized yet");
    }
  }
}

module.exports = {
  Next,
  API,
  LocalQueue,
  LongpollController,
  BotLongpollController,
  Store,
  Keyboard
}