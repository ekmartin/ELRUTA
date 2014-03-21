var data;
var chart;

var changeGraph = 0;

exports.addLineGraph = function(json) {
  console.log(json);
  var newData = [
    {
      key: 'History',
      color: '#ff7f0e',
      values: []
    },
    {
      key: 'Predicted',
      color: '#2ca02c',
      values: []
    },
    {
      key: 'Changed',
      color: '#2222ff',
      values: []
    }
  ];

  for (var key in json) {
    newData[0].values.push({
      x: json[key].timeStamp,
      y: json[key].value
    });
    var year = moment().year();
    var lastYear = year -1;
    if (lastYear in json[key].timeStamp) {
      newData[1].values.push({
        x: json[key].timeStamp.replace(String(lastYear), String(year)),
        y: json[key].value
      });
      newData[2].values.push({
        x: json[key].timeStamp.replace(String(lastYear), String(year)),
        y: json[key].value
      });
    }
  }

  d3.json(newData, function(data) {
    console.log("2", data);
    nv.addGraph(function() {
      chart = nv.models.lineWithFocusChart();

      chart.transitionDuration(500);

      chart.xAxis
          .tickFormat(function(d) {
              return d3.time.format('%d/%m/%y')
                (moment(d).format('DD/MM/YY')
              );
          });
      chart.x2Axis
          .tickFormat(d3.format(',f'));

      chart.yAxis
          .tickFormat(d3.format(',.2f'));
      chart.y2Axis
          .tickFormat(d3.format(',.2f'));

      console.log("data:", data);
      d3.select('#graph')
          .datum(data)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  });
}

exports.updateData = function(change) {
  for (var i in data[changeGraph].values) {
    data[changeGraph].values[i].y += change;
  }
}
