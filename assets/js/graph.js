d3.json('/data/cumulativeLineData.json', function(data) {
  nv.addGraph(function() {
    var chart = nv.models.lineWithFocusChart()
      .x(function(d) {
        return d[0];
      })
      .y(function(d) {
        return d[1]/100;
      });

    chart.xAxis
      .tickFormat(d3.format(',f'));
    chart.x2Axis
      .tickFormat(d3.format(',f'));

    chart.yAxis
      .tickFormat(d3.format(',.2f'));
    chart.y2Axis
      .tickFormat(d3.format(',.2f'));

    d3.select('#graph')
      .datum(data)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
});
