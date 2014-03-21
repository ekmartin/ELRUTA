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



  /* Demo Steinskjer API */
  app.get('/api/demo-steinskjer.json', function(req, res){

    var meter = req.param('meter');
    var seriesType = req.param('seriesType'); // ActivePlus, ReactivePlus, ActiveMinus, ReactiveMinus, Voltage, Ampere
    var dateFrom = req.param('dateFrom'); // YYYY-MM-DD
    var dateTo = req.param('dateTo'); // YYYY-MM-DD
    var intervalType = req.param('intervalType'); // Hour, Day, Week, Month

    request.post('https://api.demosteinkjer.no/meters/' + meter)
      .auth('da89bc51d99942e296ff69b0d0fa5782', '46dee7e281e748d097afea9c3f5d1ed2')
      .send('seriesType=' + seriesType)
      .send('dateFrom=' + dateFrom)
      .send('dateTo=' + dateTo)
      .send('intervalType=' + intervalType)
      .end(function(api){

      var getData = setInterval(function(){

          request.get(api.header.location + '/file/json')
            .auth('da89bc51d99942e296ff69b0d0fa5782', '46dee7e281e748d097afea9c3f5d1ed2')
            .end(function(json){
              console.log(json.status);
              if (json.status != 202) {

                var object = JSON.parse(json.text);

                var readings = object.meterReadings[0].meterReading.readings;

                var newReadings = [];

                for (var i = 1; i<readings.length; i++) {
                  newReadings.push({
                    value: (readings[i].value - readings[i-1].value)/1000,
                    timeStamp: readings[i].timeStamp
                  });
                }
                readings = readings.slice(1, readings.length);

                res.send(newReadings);
                clearInterval(getData);

              }
            });
        }, 100);

      });

  });



};
