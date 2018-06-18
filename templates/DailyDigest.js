const getRATPTimetable = require('../middleware/RATPTimetable');
const getWeather = require('../middleware/Weather');


async function generateMorningDigest() {
  return `Hello Yuan!\n${await getWeather()}\n${await getRATPTimetable('rers/b', 'Fontenay-aux-Roses', 'A')}`
}

async function generateEveningDigest() {
  return `Hello Yuan!\n${await getWeather()}\n${await getRATPTimetable('rers/b', 'Chatelet-Les Halles', 'R', 6)}`
}


module.exports = {
  generateMorningDigest,
  generateEveningDigest
};