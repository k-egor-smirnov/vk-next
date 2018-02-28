class BaseRoute {
  constructor (store) {
    this._store = store
    this._api = store.api
    this._commands = []
  }

  get api () {
    return this._api
  }

  get commands () {
    return this._commands
  }

  _process (ctx, message) {
    let func

    Object.keys(this.commands).map(key => {
      if (typeof ctx.message.text === 'string' && ctx.message.text.startsWith(key)) {
        func = this[this.commands[key]]
      }

      if (typeof ctx.message.body === 'string' && ctx.message.body.startsWith(key)) {
        func = this[this.commands[key]]
      }
    })

    if (!func) {
      this.default(ctx, message)
    } else {
      func(ctx, message)
    }
  }

  _processQuestion (ctx, question, message) {
    if (typeof question !== 'object') throw new Error('Question validator not provided')
    if (message.text === question.data.text && message.peer_id === ctx.userId) return
    if (message.body === question.data.text && message.user_id === ctx.userId) return

    question.data.validator(message, (err) => {
      if (!err) {
        this._store.states[ctx.userId].question = null
        question.resolvers.resolve()
      } else {
        if (err === message.text && message.peer_id === ctx.userId) return
        if (err === message.body && message.chat_id === ctx.userId) return

        question.data.onError(err)
      }
    })
  }

  static get super () {
    return BaseRoute
  }
}

module.exports = BaseRoute
