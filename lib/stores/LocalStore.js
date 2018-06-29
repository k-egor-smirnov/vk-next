const BaseStore = require("./BaseStore");
const BaseRoute = require("../models/BaseRoute");
const Context = require("../models/Context");

class Store extends BaseStore {
  constructor(api) {
    super();

    this.api = api;
    this.states = {};
  }

  use(ctx, value, resolvers) {
    if (value.super === BaseRoute) {
      const route = new value(this); // eslint-disable-line

      if (!this.states[ctx.chatId]) this.states[ctx.chatId] = {};

      this.states[ctx.chatId].route = route;
    } else if (typeof value === "object") {
      // It is question
      this.states[ctx.userId].question = { data: value, resolvers };
    }
  }

  set(ctx, key, value) {
    if (!this.states[ctx.chatId]) this.states[ctx.chatId] = {};
    if (!this.states[ctx.chatId].callbacks) this.states[ctx.chatId].callbacks = new Map();

    this.states[ctx.chatId].callbacks.set(key, value)
  }
  
  reset(ctx) {
    if (this.states[ctx.chatId || ctx.userId]) {
      this.states[ctx.chatId || ctx.userId].route = null
      this.states[ctx.chatId || ctx.userId].question = null    
    }
  }

  process(message, callback) {
    const state = this.states[message.user_id] || {};

    const ctx = new Context(
      message.peer_id,
      message.user_id,
      state.route || null,
      state.question || null,
      message,
      this.api,
      this
    );

    if (ctx.currentQuestion) {
      return ctx.currentRoute._processQuestion(
        ctx,
        ctx.currentQuestion,
        message
      );
    }

    if (ctx.currentRoute) {
      return ctx.currentRoute._process(ctx, message);
    }

    if (state.callbacks) {
      const existCallback = state.callbacks.get(ctx.message.body)

      if (existCallback) return existCallback(ctx)
    }

    callback.callback(ctx, message.data || message);

    // Object.keys(this.route.commands).map(key => {
    //   if (typeof message.body === 'string' && message.body.startsWith(key)) {
    //     this.route[this.route.commands[key]](message)
    //   }
    // })
  }
}

module.exports = Store;
