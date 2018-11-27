// Name: Amber Nobel
// Student ID: 11819359
// https://bl.ocks.org/d3noob/0e276dc70bb9184727ee47d6dd06e915 was used for constructing this code

async function loadData() {
  let res = await d3.json("data.json");
  return res.data;
}

function findAxisLabel(hovered) {
  return d3.select('.axis--x')
    .selectAll('text')
    .filter(function(x) { return x == hovered.name; });
}

function drawBars(svg, data, height, yScale) {
  var rect = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .attr('x', (d, i) => i * 32.1 + 50 )
    .attr('y', d => yScale(d['calories']))
    .attr('width', 31)
    .attr('height', d => height - yScale(d['calories']))
    .on("mouseover", d => {
      findAxisLabel(d).attr('style', "text-anchor:start; font-weight: bold;");
    })
    .on("mouseout", d => {
      findAxisLabel(d).attr('style', "text-anchor:start; font-weight: regular;");
    });
}

function xLabels(svg, data, height){
  var xScale = d3.scaleBand()
    .range([0, 1700 - 97])
    .domain(data.map(d => d.name))

  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks([50]);

  var gX = svg.append("g")
    // .attr("transform", "translate(0, 50)")
    .attr("class", "axis axis--x")
    // .attr('title-anchor', 'middle')
    .attr("transform", "translate(50," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");;
}

function yLabels(svg, data, yScale){
  const yAxis = d3.axisLeft().scale(yScale)
  var gY = svg.append("g")
    .attr("transform", "translate(50, 0)")
    .call(yAxis);
}

async function main() {
  d3.select("body").append("p").style("font-size", "34px").text("One delicious cereal bar (chart)")
  d3.select("body").append("p").text("Amber Nobel 11819359");
  d3.select("body").append("p").text("This bar chart shows the amount of calories that can be found in different brands of ceral");

  let data = await loadData();
  const height = 400;

  let svg = d3.select("body")
            .append("svg")
            .attr("width", 1700)
            .attr("height", 600)
            .attr('style', 'background: #fff');

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => { return d['calories']; })])
    .range([400, 30]);

  drawBars(svg, data, height, yScale);
  xLabels(svg, data, height);
  yLabels(svg, data, yScale);
}

main();
