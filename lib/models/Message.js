/**
 * Message model
 */
class Message {
  constructor (
    id,
    flags,
    peer_id,
    timestamp,
    text,
    attachments,
    random_id
  ) {
    this.id = id
    this.flags = flags
    this.peer_id = peer_id
    this.timestamp = timestamp
    this.text = text

    this.attachments = attachments || null
    this.random_id = random_id || null
  }
}

module.exports = Message
