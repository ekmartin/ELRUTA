var data;
var realtimeData;
var chart;
var realtimeChart;

var changeGraph = 2;

exports.addRealtimeGraph = function(json) {
  $('#graph').empty();
  chart = null;
  nv.addGraph(function() {
      realtimeChart = nv.models.lineChart()
        .options({
          showXAxis: true,
          showYAxis: true,
          transitionDuration: 250,
          margin: {left: 100, bottom: 50}
        });

      //chart.useInteractiveGuideline(true);
      realtimeChart.xAxis
        .axisLabel('Klokkeslett')
        .tickFormat(function(d) {
            return d3.time.format('%H:%M')(new Date(d*1000));
        });
      realtimeChart.yAxis
        .axisLabel('Strømforbruk (kW/h)')
        .tickFormat(d3.format(',2f'));

      d3.select('#graph')
          .datum(realtimeData)
          .call(realtimeChart);

      nv.utils.windowResize(function() {
        if (realtimeChart != null) {
          console.log("rtchart rez");
          realtimeChart.update();
        }
      });

      return realtimeChart;
    });
};

exports.addLineGraph = function(json) {
  $('#graph').empty();
  realtimeChart = null;
  data = [
    {
      key: 'History',
      color: '#ff0000',
      values: []
    },
    {
      key: 'Predicted',
      color: '#00ff00',
      values: []
    }
  ];

  for (var key in json) {
    var year = moment().year();
    var lastYear = year -1;
    var timeStamp = moment(json[key].timeStamp, 'YYYY-MM-DD');
    var modTimeStamp = moment(json[key].timeStamp.replace(String(lastYear), String(year)), 'YYYY-MM-DD');
    data[0].values.push({
      x: timeStamp.unix(),
      y: json[key].value
    });
    if (!modTimeStamp.isBefore()) {
      data[1].values.push({
        x: modTimeStamp.unix(),
        y: json[key].value
      });
    }
  }

nv.addGraph(function() {
    chart = nv.models.lineWithFocusChart()
      .options({
        showXAxis: true,
        showYAxis: true,
        transitionDuration: 250,
        margin: {left: 100, bottom: 50}
      });

    //chart.useInteractiveGuideline(true);
    chart.xAxis
      .axisLabel('Date')
      .tickFormat(function(d) {
          return d3.time.format('%d/%m/%y')(new Date(d*1000));
      });
    chart.x2Axis
      .tickFormat(function(d) {
          console.log("d:", d);
          return d3.time.format('%d/%m/%y')(new Date(d*1000));
      });
    chart.yAxis
      .axisLabel('Strømforbruk (kW/h)')
      .tickFormat(d3.format('d'));
    chart.y2Axis
      .tickFormat(d3.format('d'));

    d3.select('#graph')
        .datum(data)
        .call(chart);

    nv.utils.windowResize(function() {
      if (chart != null) {
        console.log("chart rez");
        chart.update();
      }
    });

    return chart;
  });
};

exports.updateLiveData = function(json) {
  realtimeData = [
    {
      key: 'Realtime',
      color: '#00ff00',
      values: []
    }
  ];

  for (var i = json.length - 20; i < json.length; i++) {
    var timeStamp = moment(json[i].timeStamp);
    realtimeData[0].values.push({
      x: timeStamp.unix(),
      y: json[i].value*1000
    });
  }
  console.log("new data:", realtimeData);
  if (!realtimeChart) {
    exports.addRealtimeGraph(realtimeData);
  }
  else {
    exports.addRealtimeGraph(realtimeData);
    console.log("updaing realtimeChart");
    realtimeData[0].values.shift();
    realtimeChart.update();
  }
};

exports.updateData = function(change) {
  if (!data[2]) {
    data.push(
      {
        key: 'Changed',
        color: '#0000ff',
        values: []
      }
    );
    for (var i = 0; i < data[1].values.length; i++) {
      data[2].values.push({
        x: data[1].values[i].x,
        y: data[1].values[i].y
      });
    }
  }

  for (var j in data[changeGraph].values) {
    data[changeGraph].values[j].y *= change;
  }

  console.log(data);
  chart.update();
};
