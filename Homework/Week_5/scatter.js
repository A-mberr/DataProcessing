// Name: Amber Nobel
// Student ID: 11819359

function computeXScale(graph) {
  const {width, padding} = graph;

  return d3.scaleLinear()
     .domain([2006, 2015])
     .range([padding, width - padding * 2]);
}

function computeYScale(data, graph){
  const {padding, height} = graph;

  return d3.scaleLinear()
    .domain([0, d3.max(data[0], d => {return d.datapoint; })])
    .range([height - padding, padding]);
}

function drawXAxis(){
  // Create the Axis
  var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks([11]);

  svg.append("g")
     .attr("transform", "translate(0, 450)")
     .call(xAxis);
}

function drawYaxis(){
  var yAxis = d3.axisLeft()
                .scale(yScale);

  svg.append("g")
     .call(yAxis)
     .attr("transform", "translate(50, 0)");
}

function renderData(data, graph) {
  const {width, height, padding} = graph;

  // Plot the coordinates of dataset1
  var dots = svg.selectAll("circle")
    .data(data[0])
    .enter()
    .append("circle")
    .attr("cx", d => {
      return graph.xScale(d.time);
    })
    .attr("cy", d => {
      return graph.yScale(d.datapoint);
    })
    .attr("r", 3)
    .attr("fill", "pink");

  svg.selectAll("circle")
    .transition()
    .duration(750)
    .style("fill", "blue");

}

function main() {
  let p1 = d3.json("msti.json");
  let p2 = d3.json("consConf.json");

  const graph = {
    width: 1000,
    height: 500,
    padding: 50,
  };

  let svg = d3.select("body")
    .append("svg")
    .attr("width", graph.width + graph.padding)
    .attr("height", graph.height + graph.padding)
    .attr('style', 'background: #fff');

  Promise.all([p1, p2]).then(resp => {
    graph.xScale = computeXScale(graph);
    graph.yScale = computeYScale(resp, graph);
    renderData(resp, graph);
  }).catch(function(e){
    d3.select("body")
      .append("p")
      .text("error: " + e);
    throw(e);
  });

  // TODO: Move to HTML
  d3.select("body").append("p").text("http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015");
  d3.select("body").append("p").text("http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015");
};

// Use 'addEventListener' instead of 'window.onload = function() {};' to avoid
// overwriting a previously set function handler.
window.addEventListener("load", function() {
  main();
});
