# VK-Next
> Библиотека для VK API, поддерживающая LongPoll API, новый Bot LongPoll API и Callback API, основанная на кодогенерации методов из JSON схемы
С данной библиотекой вы можете как создавать ботов, так и сделать свой клиент благодаря полной поддержке всего API

[![npm](https://img.shields.io/npm/v/vk-next.svg)](https://www.npmjs.com/package/vk-next)

# Внимание
Разработка библиотеки приостановлена из-за неразрешимых проблем с хранением состояния ботов и ее неакутальности на данный момент.

## Roadmap
- Поддержка VK API ✅
- Удобный интерфейс для ботов
  - Роуты для сообщений ✅
  - Хранилище сессий
  - Локализация
- Утилиты для работы (генерация битовой маски, ссылки для токена)

## Настройка

## Получение сообщений
В данный момент библиотека поддерживает 2 типа получения событий: Bot Longpoll API и Longpoll API, в будущем будет поддержка Callback API

Пример для Bot Longpoll API 
```javascript
vk.on('message_new', (ctx, message) => {
  console.log('new message: ' + message.body)
})
```

Пример для Longpoll API
```javascript
vk.on(4, (ctx, message) => {
  console.log('new message: ' + message.text)
})
```

## Роутинг
Пример роута

```javascript
const { BaseRoute } = require('vk-next')

class TestRoute extends BaseRoute {
  test (ctx, message) {
    ctx.api.messages.send({
      peer_id: ctx.userId,
      message: 'Test!'
    })
  }

  default (ctx, message) {
    ctx.api.messages.send({
      peer_id: ctx.userId,
      message: 'You wrote: ' + message.text
    })
  }

  get commands () {
    return {
      '/test': 'test',
    }
  }
}

module.exports = TestRoute
```


```javascript
ctx.use(TestRoute)
```

## LICENSE
The MIT License (MIT)

Copyright © 2018 Egor Smirnov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
