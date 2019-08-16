const rp = require('request-promise');
const moment = require('moment-timezone');

async function getWeather() {
  let w;
  try {
    w =  await rp({
      uri: 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="paris, france") and u = "c"&format=json',
      json: true
    });
  } catch (e) {
    return "Request error. Failed to get weather."
  }

  const hour = moment().tz("Europe/Paris").hour();
  const day = hour <= 18 ? 'Today':'Tomorrow';
  const dayIndex = hour <= 18 ? 0:1;
  const {date, text, high, low} = w.query.results.channel.item.forecast[dayIndex];
  return `${day} on ${date} in Paris, the weather will be *${text.toLowerCase()}*, ${low} - ${high} °C. `;
}

module.exports = getWeather;
