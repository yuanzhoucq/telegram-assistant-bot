const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const CronJob = require('cron').CronJob;

const { generateMorningDigest, generateEveningDigest } = require('./templates/DailyDigest');
const getRATPTimetable = require('./middleware/RATPTimetable');
const getWeather = require('./middleware/Weather');

const bot = new Telegraf(process.env.BOT_TOKEN);

const globalReplyPara = {
  parse_mode: 'Markdown'
};

// salutation
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

// generate the auto reply keyboard
bot.hears('hi', (ctx) => ctx.reply('Hey there, special keyboard has been activated!',
  { reply_markup: Markup.keyboard([
      ['RER from work', 'RER from home'],
      ['Weather in Paris', 'Bus from home'],
      ['Morning digest','Evening digest']
    ]).resize() }));

// set the keyword replies
bot.hears(/rer from home/i, async (ctx) =>
  ctx.reply(await getRATPTimetable('rers/b', 'Fontenay-aux-Roses', 'A'), globalReplyPara));
bot.hears(/bus from home/i, async (ctx) =>
  ctx.reply(`${await getRATPTimetable('bus/394', 'Chateau Sainte Barbe', 'A')}\n${await getRATPTimetable('bus/128', 'Chateau Sainte Barbe', 'A')}`, globalReplyPara));
bot.hears(/rer from work/i, async (ctx) =>
  ctx.reply(await getRATPTimetable('rers/b', 'Chatelet-Les Halles', 'R', 6), globalReplyPara));

bot.hears(/weather/i, async (ctx) => ctx.reply(await getWeather(), globalReplyPara));

bot.hears(/morning digest/i, async (ctx) => ctx.reply(await generateMorningDigest(),
  globalReplyPara));
bot.hears(/evening digest/i, async (ctx) => ctx.reply(await generateEveningDigest(),
  globalReplyPara));

// Cron jobs
new CronJob('0 15 8 * * *',
  async () => bot.telegram.sendMessage('323803683',await generateMorningDigest(), globalReplyPara),
  null, true, 'Europe/Paris');
new CronJob('0 55 17 * * *',
  async () => bot.telegram.sendMessage('323803683',await generateEveningDigest(), globalReplyPara),
  null, true, 'Europe/Paris');


bot.startPolling();
