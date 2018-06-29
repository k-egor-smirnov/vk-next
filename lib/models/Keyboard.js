const nanoid = require('nanoid')

class Keyboard {
  constructor(keyboard, options) {
    this.validate(keyboard)
    this.options = options
    this.keyboard = keyboard
  }

  validate(keyboard) {
    const valid = Object.keys(keyboard).every((key) => {
      return typeof key === 'string' && typeof keyboard[key] === 'function'
    })

    if (!valid) throw new Error('invalid keyboard')
  }

  serialize(ctx) {
    const serializedKeyboard = {
      one_time: this.options.one_time || false,
      buttons: []
    }
    
    Object.keys(this.keyboard).forEach(key => {
      serializedKeyboard.buttons.push([{
        action: {
          type: 'text',
          label: key
        },
        color: "negative"
      }])
    })

    return JSON.stringify(serializedKeyboard)
  }

  build(ctx) {
    Object.keys(this.keyboard).map(key => {
      ctx.store.set(ctx, key, this.keyboard[key])
    })

    const serializedKeyboard = this.serialize(ctx)

    return serializedKeyboard
  }
}

module.exports = Keyboard