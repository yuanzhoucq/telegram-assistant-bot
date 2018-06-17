const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const CronJob = require('cron').CronJob;

const getRERTable = require('./middleware/RERTimetable');
const getWeather = require('./middleware/Weather');

const bot = new Telegraf(process.env.BOT_TOKEN);

const globalReplyPara = {
  parse_mode: 'Markdown'
};

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));

bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.hears('hi', (ctx) => ctx.reply('Hey there, special keyboard has been activated!',
  { reply_markup: Markup.keyboard(['RER from home', 'Weather in Paris', 'Daily digest']).resize() }));
bot.hears(/rer/i, async (ctx) =>
  ctx.reply(await getRERTable(), globalReplyPara));
bot.hears(/weather/i, async (ctx) => ctx.reply(await getWeather(), globalReplyPara));
bot.hears(/daily/i, async (ctx) => ctx.reply(`Hello Yuan!\n${await getWeather()}\n${await getRERTable()}`,
  globalReplyPara));

new CronJob(
  '0 15 8 * * *',
  async () => bot.telegram.sendMessage('323803683',`Hello Yuan!\n${await getWeather()}\n${await getRERTable()}`,
    globalReplyPara),
  null,
  true,
  'Europe/Paris'
);

bot.startPolling();
