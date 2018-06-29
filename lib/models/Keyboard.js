const nanoid = require('nanoid')

class Keyboard {
  constructor(keyboard, options) {
    this.validate(keyboard)
    this.options = options
    this.keyboard = keyboard
  }

  validate(keyboard) {
   
  }

  serialize(ctx) {
    const serializedKeyboard = {
      one_time: this.options.one_time || false,
      buttons: []
    }

    const { keyboard, options: { layout } } = this
    const buttons = Object.keys(keyboard)
    
    if (typeof layout === 'number') {

    } else {
      let button;
      let layoutIndex = 0
      let line = 0

      do {
        button = buttons.shift()
        if (!button) break;

        if (!serializedKeyboard.buttons[line]) serializedKeyboard.buttons[line] = []
        serializedKeyboard.buttons[line].push({
          action: {
            type: 'text',
            label: keyboard[button].label
          },
          color: keyboard[button].color
        })
        
        if(serializedKeyboard.buttons[line].length > layoutIndex) {
          line++
          layoutIndex++
        }

      } while (button)
    }
    
    // Object.keys(this.keyboard).forEach(key => {
    //   serializedKeyboard.buttons.push([{
    //     action: {
    //       type: 'text',
    //       label: key
    //     },
    //     color: "negative"
    //   }])
    // })

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