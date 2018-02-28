const mask = require('../utils/mask')
const Message = require('../models/Message')

/**
 *
 * @param {Object} updates Updates array
 * @returns {Object} Parsed events
 */
module.exports = (updates) => {
  let events = []

  for (let update of updates) {
    if (update[0] === 4) {
      let message = new Message(
        update[1],
        mask.parseMessage(update[2]),
        update[3],
        update[4],
        update[5],
        update[6],
        update[7]
      )

      events.push({ type: 'message_new', data: message })
      events.push({ type: update[0], data: message })
      events.push({ type: '*', data: message })
    } else {
      events.push({ type: update.type, data: update })
      events.push({ type: '*', data: update })
    }
  }

  return events
}
