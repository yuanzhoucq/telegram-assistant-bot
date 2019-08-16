const Markup = require('telegraf/markup');
const CronJob = require('cron').CronJob;

const { generateMorningDigest, generateEveningDigest } = require('../templates/DailyDigest');
const getRATPTimetable = require('../middleware/RATPTimetable');
const getWeather = require('../middleware/Weather');

const globalReplyPara = {
    parse_mode: 'Markdown'
};

module.exports = (bot) => {
    // generate the auto reply keyboard
    bot.hears(/paris mode/i, (ctx) => ctx.reply('Hey there, paris mode keyboard has been activated!',
        {
            reply_markup: Markup.keyboard([
                ['RER from work', 'RER from home'],
                ['Weather in Paris', 'Bus from home'],
                ['Morning digest', 'Evening digest']
            ]).resize()
        }));

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
    // new CronJob('0 15 8 * * 1-5',
    //   async () => bot.telegram.sendMessage('323803683',await generateMorningDigest(), globalReplyPara),
    //   null, true, 'Europe/Paris');
    // new CronJob('0 05 18 * * 1-5',
    //   async () => bot.telegram.sendMessage('323803683',await generateEveningDigest(), globalReplyPara),
    //   null, true, 'Europe/Paris');
};
