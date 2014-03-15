var request = require('superagent');

module.exports = function(app) {
  app.get('/api/readings.json', function(req, res) {
    request.get('https://api.demosteinkjer.no/examplefiles/download-6.json')
      .end(function(data) {
        res.send(data.body.meterReadings.reduce(function(readings, reading) {
          readings[reading.meterReading.meterAsset.mRID] = reading.meterReading.readings;
          return readings;
        }, {}));
      });
  });
};
