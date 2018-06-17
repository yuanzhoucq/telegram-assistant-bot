const rp = require('request-promise');

async function getRERTimeTable(count = 4) {
  const t =  await rp({
    uri: 'https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/b/fontenay-aux-roses/A',
    json: true
  });

  let timetableMarkUp = 'Upcoming trains at Fontenay-aux-Roses: \n';
  t.result.schedules.slice(0, count).forEach((item, index) => timetableMarkUp += `\`#${index+1} ${item.message} -> ${item.destination}\` \n`);

  return timetableMarkUp
}

module.exports = getRERTimeTable;