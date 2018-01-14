let messageFlags = {
  1: 'UNREAD',
  2: 'OUTBOX',
  4: 'REPLIED',
  8: 'IMPORTANT',
  16: 'CHAT',
  32: 'FRIENDS',
  64: 'SPAM',
  128: 'DELЕTЕD',
  256: 'FIXED',
  512: 'MEDIA',
  65536: 'HIDDEN'
}

/**
 * Parse message flags
 * @param {Number} flags Flags
 * @returns {Object} String flags array
 */
module.exports.parseMessage = (flags) => {
  let flagsArray = []

  for (let key of Object.keys(messageFlags)) {
    (flags & key) === Number(key) && flagsArray.push(messageFlags[key])
  }

  return flagsArray
}
