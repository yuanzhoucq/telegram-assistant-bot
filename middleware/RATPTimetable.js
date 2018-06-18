const rp = require('request-promise');

async function getRATPTimeTable(line, station, direction, count = 4) {
  const t =  await rp({
    uri: `https://api-ratp.pierre-grimaud.fr/v3/schedules/${line}/${station}/${direction}`,
    json: true
  });

  let timetableMarkUp = `Upcoming transport at ${station}: \n`;
  t.result.schedules.slice(0, count).forEach((item, index) => timetableMarkUp += `\`#${index+1} ${item.message} -> ${item.destination}\` \n`);

  return timetableMarkUp
}

module.exports = getRATPTimeTable;