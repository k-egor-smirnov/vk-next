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
    let params = []

    for (let key of Object.keys(this.params)) {
      params.push(`{"${key}": ${this.params[key]}}`)
    }

    return `API.${this.method}(${params.toString()})`
  }
}

module.exports = Request
