class Request {
  /**
   * Create VK API requset
   * @param {String} method Request method
   * @param {Object} params Request params
   */
  constructor (method, params = []) {
    this.method = method
    this.params = params
  }

  buildString () {
    return `API.${this.method}(${JSON.stringify(this.params)})`
  }
}

module.exports = Request
