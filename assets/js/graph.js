var data;
var chart;

var changeGraph = 0;

exports.addLineGraph = function(json) {
  var newData = [
    {
      key: 'History',
      color: '#ff0000',
      values: []
    },
    {
      key: 'Predicted',
      color: '#00ff00',
      values: []
    },
    {
      key: 'Changed',
      color: '#0000ff',
      values: []
    }
  ];

  for (var key in json) {
    var year = moment().year();
    var lastYear = year -1;
    var timeStamp = moment(json[key].timeStamp, 'YYYY-MM-DD');
    var modTimeStamp = moment(json[key].timeStamp.replace(String(lastYear), String(year)), 'YYYY-MM-DD');
    newData[0].values.push({
      x: timeStamp.unix(),
      y: json[key].value
    });
    if (!modTimeStamp.isBefore()) {
      newData[1].values.push({
        x: modTimeStamp.unix(),
        y: json[key].value
      });
      newData[2].values.push({
        x: modTimeStamp.unix(),
        y: json[key].value
      });
    }
  }
  console.log(newData,"her");
  nv.addGraph(function() {
    chart = nv.models.lineWithFocusChart();

    chart.transitionDuration(500);

    chart.xAxis
      .axisLabel('Date')
      .tickFormat(function(d) {
          return d3.time.format('%d/%m/%y')(new Date(d*1000));
      });
    chart.x2Axis
      .axisLabel('Date')
      .tickFormat(function(d) {
          console.log("d:", d);
          return d3.time.format('%d/%m/%y')(new Date(d*1000));
      });
    chart.yAxis
        .tickFormat(d3.format('d'));
    chart.y2Axis
        .tickFormat(d3.format('d'));

    d3.select('#graph')
        .datum(newData)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
};

exports.updateData = function(change) {
  for (var i in data[changeGraph].values) {
    data[changeGraph].values[i].y += change;
  }
};
