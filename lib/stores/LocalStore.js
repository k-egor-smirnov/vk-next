const BaseStore = require('./BaseStore')
const BaseRoute = require('../models/BaseRoute')
const Context = require('../models/Context')

class Store extends BaseStore {
  constructor (api) {
    super()

    this.api = api
    this.states = {}
  }

  use (ctx, value, resolvers) {
    if (value.super === BaseRoute) {
      const route = new value(this) // eslint-disable-line

      if (!this.states[ctx.userId]) this.states[ctx.userId] = {}

      this.states[ctx.userId].route = route
    } else if (typeof value === 'object') { // It is question
      if (this.states[ctx.userId].question) throw new Error('Question already asked')

      this.states[ctx.userId].question = { data: value, resolvers }
    }
  }

  process (message, callback) {
    const state = this.states[message.user_id] || {}

    const ctx = new Context(
      message.peer_id,
      message.user_id,
      state.route || null,
      state.question || null,
      message,
      this.api,
      this
    )

    if (ctx.currentQuestion) {
      return ctx.currentRoute._processQuestion(ctx, ctx.currentQuestion, message)
    }

    if (ctx.currentRoute) {
      return ctx.currentRoute._process(ctx, message)
    }

    callback.callback(ctx, message.data || message)

    // Object.keys(this.route.commands).map(key => {
    //   if (typeof message.body === 'string' && message.body.startsWith(key)) {
    //     this.route[this.route.commands[key]](message)
    //   }
    // })
  }
}

module.exports = Store
