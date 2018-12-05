// Name: Amber Nobel
// Student ID: 11819359

function initGraph() {
  const svg = d3.select("svg");

  // Geometry of inner svg plotting area.
  const margin = {
      top: 40,
      right: 140,
      bottom: 40,
      left: 60
  };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const content = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

  const legend = svg.append("g")
    .attr("transform",
      "translate(" + (width + margin.left) +
      "," + (height / 2) + ")"
    );

  const graph = {
    svg: svg,
    content: content,
    legend: legend,
    margin: margin,
    width: width,
    height: height,
    xScale: d3.scaleBand().range([0, width]).domain([0, 0]),
    yScale: d3.scaleLinear().range([height, 0]).domain([0, 0]),
    xAxis: null,
    yAxis: null,
  };

  graph.xAxis = drawXAxis(graph);
  graph.yAxis = drawYAxis(graph);

  d3.select("svg").append("text")
  .attr("x", (width + margin.left + margin.right) / 2)
  .attr("y", margin.top - 4)
  .attr("text-anchor", "middle")
  .style("text-decoration", "underline")
  .style("font-size", "30px")
  .text("Scatter plots")

  content.append("text")
  .style("font-size", "12px")
  .attr("text-anchor", "end")
  .attr("transform",
    "translate(" + graph.width + "," +
    (graph.height + (graph.margin.bottom / 5 * 4)) + ")"
  )
  .text("Calendar years")

  return graph;
}

function updateXScale(graph, data) {
  // Use all years as an X axis label.
  graph.xScale.domain(data.map(d => d.time));

  // Update X Axis
  graph.svg.select(".x.axis")
    .transition()
    .duration(400)
    .call(graph.xAxis);
}

function updateYScale(graph, data) {
  // Compute the minimum and maximum value.
  const values = data.map(d => d.datapoint);
  const domain = [
    d3.min(values),
    d3.max(values),
  ];

  // Add five percent above and below the Y axis' domain to avoid clamping the
  // content area to the Y axis. Five percent is computed relative to the
  // difference between the minimum and maximum domain value. Higher domain
  // values should not create a larger margin than lower domains.
  const axisMargin = 0.05;
  const difference = (domain[1] - domain[0]) * axisMargin;
  domain[0] = domain[0] - difference;
  domain[1] = domain[1] + difference;

  graph.yScale.domain(domain);

  // Update Y Axis
  graph.svg.select(".y.axis")
    .transition()
    .duration(400)
    .call(graph.yAxis);
}

function uniqueCountries(data) {
  let found = {};
  data.forEach(d => {
    found[d.Country] = true;
  })

  return Object.keys(found);
}

function buildColorMap(data) {
  // Determine colors for graph data.
  let countries = uniqueCountries(data);

  // Start with a base color and increment the 'hue' value for different colors.
  let base = d3.hsl("#cb3030");
  const colors = {};
  countries.forEach(country => {
    colors[country] = base.toString();
    base.h = (base.h + 60) % 360;
  });

  return colors;
}

function renderLegend(graph, colors) {
  const data = Object.entries(colors);

  // Render the labels.
  graph.legend.selectAll('rect')
    .remove()
    .exit()
    .data(data)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr("y", (d, i) => i * 20 - 20 + 6)
    .attr('width', 20 - 3)
    .attr('height', 20 - 3)
    .style('fill', d => d[1])
    ;

  // Render the labels.
  graph.legend.selectAll('text')
    .remove()
    .exit()
    .data(data)
    .enter()
    .append('text')
    .attr('x', 20)
    .attr("y", (d, i) => i * 20)
    .text(d => d[0])
    ;
}

function renderScatterDots(graph, data, colors) {
  const {xScale, yScale, content} = graph;

  // Draw the scatter dots.
  // Center the dots in the band using "bandwidth() / 2". This idea comes from:
  // https://bl.ocks.org/d3indepth/1aef77d17863e603ff4e84226db5b227
  content.selectAll("circle")
    .remove()
    .exit()
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.time))
    .attr("cy", d => yScale(d.datapoint))
    .attr("r", 3)
    .attr("fill", "#ffffff")
    .attr('transform', 'translate(' + (xScale.bandwidth() / 2) + ', 0)')

    // Transition to black after some milliseconds.
    .transition()
    .duration(1000)
    //.attr("fill", "#000000")
    .attr("fill", d => colors[d.Country]);
}

function drawXAxis(graph) {
  var xAxis = d3.axisBottom()
    .scale(graph.xScale);

  graph.content.append('g')
    .attr('class', 'x axis')
    .attr("transform", "translate(0," + graph.height + ")")
    .call(xAxis);

  return xAxis;
}

function drawYAxis(graph) {
  var yAxis = d3.axisLeft()
    .scale(graph.yScale);

  graph.content.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  return yAxis;
}

function updateData(graph, data) {
  const colors = buildColorMap(data);

  updateYScale(graph, data);
  updateXScale(graph, data);

  renderLegend(graph, colors);
  renderScatterDots(graph, data, colors);
}

function showData(filename) {
  d3.json(filename).then(data => {

    // Women in science dataset does not have a 'Country' field. This code sets
    // the value to 'Women'. That causes a 'Women' entry in the legend.
    // Otherwise, the value 'undefined' is printed.
    data = data.map(d => {
      if (!d.Country)
        d.Country = 'Women';
      return d;
    });

    updateData(graph, data);
  }).catch(e => {
    // Oh no, an error occurred. Notify the user!
    d3.select("body")
      .append("p")
      .text("error: " + e);
    console.error(e);
    throw(e);
  });
}


// Use 'addEventListener' instead of 'window.onload = function() {};' to avoid
// overwriting a previously set function handler.
window.addEventListener("load", function() {
  window.graph = initGraph();
  showData('msti.json')
});
