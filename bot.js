const Telegraf = require('telegraf');
const parisMode = require('./modes/Paris');
const bot = new Telegraf(process.env.BOT_TOKEN);

// salutation
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

parisMode(bot);

bot.startPolling();
