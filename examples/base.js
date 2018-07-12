const { LocalQueue, Next } = require('../lib/index.js')

const next = new Next(
    '',
    new LocalQueue(),
    {
        isGroup: true
    }
);

(async () => {
    await next.startBotPolling(128335970);

    console.log('poll started')
    next.on('new_message', async (ctx, message) => {
        console.log(ctx, message)
    })
})();