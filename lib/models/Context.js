const uploadHelper = require("../helpers/upload");

class Context {
  constructor(
    userId,
    chatId,
    currentRoute,
    currentQuestion,
    message,
    api,
    store
  ) {
    this._userId = userId;
    this._chatId = chatId;
    this._currentRoute = currentRoute;
    this._currentQuestion = currentQuestion;
    this._message = message;
    this._api = api;
    this._store = store;
  }

  get userId() {
    return this._userId;
  }

  get chatId() {
    return this._chatId;
  }

  get currentRoute() {
    return this._currentRoute;
  }

  get currentQuestion() {
    return this._currentQuestion;
  }

  get message() {
    return this._message;
  }

  get api() {
    return this._api;
  }

  get store() {
    return this._store;
  }

  use(route) {
    return this._store.use(this, route);
  }

  ask(question) {
    const ctx = this;

    return new Promise(async resolve => {
      await ctx.api.messages.send({
        peer_id: this.userId,
        message: question.text
      });

      this._store.use(ctx, question, { resolve });
    });
  }

  sendMessage(message, ...data) {}

  uploadPhoto(path, peerId) {
    return uploadHelper.uploadMessagePhoto(this, path, peerId);
  }
}

module.exports = Context;
