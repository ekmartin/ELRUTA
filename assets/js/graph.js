var data;
var chart;

var changeGraph = 0;

function addLineGraph(json) {
  d3.json(json, function(data) {
    nv.addGraph(function() {
      chart = nv.models.lineWithFocusChart();

      chart.transitionDuration(500);

      chart.xAxis
          .tickFormat(function(d) {
              return d3.time.format('%d/%m/%y')(
                console.log(d);
                moment(d).format('DD/MM/YY');
              );
          });
      chart.x2Axis
          .tickFormat(d3.format(',f'));

      chart.yAxis
          .tickFormat(d3.format(',.2f'));
      chart.y2Axis
          .tickFormat(d3.format(',.2f'));

      data = testData();

      console.log("data:", data);
      d3.select('#graph')
          .datum(data)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  });
}

function updateData(change) {
  for (var i in data[changeGraph].values) {
    data[changeGraph].values[i].y += change;
  }
}
