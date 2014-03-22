var data;
var realtimeData;
var yearlyData; 

var chart;
var realtimeChart;
var yearlyChart;

var changeGraph = 2;

var clearGraph = function() {
  $('#graph').empty();
  chart = null;
  realtimeChart = null;
  yearlyChart = null;
}

exports.addYearlyGraph = function(json) {
  console.log("blir kalt");
  clearGraph();
  yearlyData = [{
    key: 'Årsforbruk',
    color: '#312e3f',
    values: []
  }];

  var months = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0
  };
  console.log("fe", json);

  var year = moment().year();
  var lastYear = year - 1;

  for (var key in json) {
    var timeStamp = moment(json[key].timeStamp, 'YYYY-MM-DD');
    if (timeStamp.isSame(timeStamp, 'year')) {
      console.log("her", timeStamp.month());
      months[timeStamp.month()] += json[key].value;
    }
  }
  console.log(months, "months");
  for (var i = 0; i < 12; i++) {
    console.log("pushing");
    yearlyData[0].values.push({
      x: moment().month(i).format('MMMM'),
      y: months[i]
    });
  }

  nv.addGraph(function() {
    yearlyChart = nv.models.discreteBarChart()
      .staggerLabels(true)
      .showValues(true)
      .transitionDuration(250)
      .options({
        margin: {left: 100, bottom: 50}
      });

    yearlyChart.xAxis
      .axisLabel('Måned');

    yearlyChart.yAxis
      .axisLabel('Strømforbruk (kW/h)');

    d3.select('#graph')
      .datum(yearlyData)
      .call(yearlyChart);

    nv.utils.windowResize(function() {
      if (yearlyChart != null) {
        yearlyChart.update();
      }
    });
  });
};

exports.addRealtimeGraph = function(json) {
  clearGraph();
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
        realtimeChart.update();
      }
    });

    return realtimeChart;
  });
};

exports.addLineGraph = function(json) {
  clearGraph();
  data = [
    {
      key: 'Historikk',
      color: '#e9e9e7',
      values: []
    },
    {
      key: 'Estimert',
      color: '#312e3f',
      values: []
    }
  ];

  for (var key in json) {
    var year = moment().year();
    var lastYear = year - 1;
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
        chart.update();
      }
    });

    return chart;
  });
};

exports.updateLiveData = function(json) {
  realtimeData = [
    {
      key: 'Sanntid',
      color: '#a8bf46',
      values: []
    }
  ];

  for (var i = json.length - 20; i < json.length; i++) {
    var timeStamp = moment(json[i].timeStamp);
    realtimeData[0].values.push({
      x: timeStamp.unix(),
      y: json[i].value
    });
  }

  if (!realtimeChart) {
    exports.addRealtimeGraph(realtimeData);
  }
  else {
    exports.addRealtimeGraph(realtimeData);
    realtimeData[0].values.shift();
    realtimeChart.update();
  }
};

exports.updateData = function(change) {
  if (chart) {
    if (!data[2]) {
      data.push(
        {
          key: 'Forbedret',
          color: '#a8bf46',
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

    for (var j in data[2].values) {
      data[2].values[j].y = data[1].values[j].y*change;
    }

    console.log(data);
    chart.update();
  } 
};
