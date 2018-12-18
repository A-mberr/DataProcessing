// Name: Amber Nobel
// Student ID: 11819359
// https://bl.ocks.org/d3noob/0e276dc70bb9184727ee47d6dd06e915 was used for constructing this code

async function loadData() {
  let data = await d3.json("data.json");
  return data;
}

function findAxisLabel(hovered) {
  //function finds the labels of the x axis for the mouse over event
  return d3.select('.axis--x')
    .selectAll('text')
    .filter(function(x) { return x == hovered.name; });
}

function drawBars(svg, data, height, yScale) {
  //draws the bars of the chart with the amount of calories displayed in height
  var rect = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .attr('x', (d, i) => i * 32.1 + 50 )
    .attr('y', d => yScale(d['calories']))
    .attr('width', 31)
    .attr('height', d => height - yScale(d['calories']))
    // when mouse runs over bar, the labels are becomming bold
    .on("mouseover", d => {
      findAxisLabel(d).attr('style', "text-anchor:start; font-weight: bold;");
    })
    .on("mouseout", d => {
      findAxisLabel(d).attr('style', "text-anchor:start; font-weight: regular;");
    })
    .on("click", showPieChart);
}

function xLabels(svg, data, height){
  var xScale = d3.scaleBand()
    .range([0, 1700 - 97])
    .domain(data.map(d => d.name))

  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks([50]);

  // places the cereal brands rotated on the x axis so the labels are readible
  var gX = svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(50," + height + ")")
    .style("font-size", "20px")
    .transition()
    .duration(400)
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
    .call(yAxis)
    .transition()
    .duration(400)
    .style("font-size", "20px");

    svg.append("text")
      .attr("x", 45)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-family", "Arial Black")
      .text("Calories")
}

function chartTitle(svg){
  svg.append("text")
    .attr("x", 750)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "28px")
    .style("font-family", "Arial Black")
    .text("Pick the cereal brand to get to know the nutritional values")
}

function showPieChart(data){
  // code is based on the information in this video:
  // https://www.youtube.com/watch?v=P8KNr0pDqio
  var width = 700;
  var height = 800;
  var colors = d3.scaleOrdinal(d3.schemeDark2);

  d3.select('svg.pie').remove();

  var svg = d3.select("body").append("svg")
    .attr('class', 'pie')
    .attr("width", width)
    .attr("height", height)
    .style("background", "#edffdb")

  var details = [data['fat'], data['protein'], data['carbo'], data['sugars']]
  var labels = ["Fat", "Protein", "Carbs", "Sugar"]
  var brand = [data["name"]]

  // draws the pie chart based on the information in segments
  var content = d3.pie().sort(null)(details);

  var segments = d3.arc()
                  .innerRadius(0)
                  .outerRadius(200)
                  .padAngle(.05)
                  .padRadius(50);

  var sections = svg.append("g").attr("transform", "translate(300, 350)")
                  .selectAll("path").data(content);

  sections.enter().append("path").attr("d", segments).attr("fill", (d, i) => colors(i));

  // creates the rectangles for the legend
  svg.selectAll('rect')
    .data(details)
    .enter()
    .append('rect')
    .attr('x', 450)
    .attr("y", (d, i) => i * 20 - 20 + 60)
    .attr('width', 20 - 3)
    .attr('height', 20 - 3)
    .attr('fill', (d, i) => colors(i))

  // creates legend labels
  svg.selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('x', 480)
    .attr("y", (d, i) => i * 20 + 55)
    .text(d => d)
    ;

  // Sets title within the pie chart svg
  svg.append("text")
    .attr("x", 230)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .transition()
    .duration(300)
    .style("font-size", "22px")
    .style("font-family", "Arial Black")
    .text(brand)
}


async function main() {

  let data = await loadData();
  console.log(data)

  const height = 400;

  let svg = d3.select("body")
            .append("svg")
            .attr("width", 1700)
            .attr("height", 800)
            .attr('style', 'background: #edffdb')
            .attr("transform", "translate(100, 100)")

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => { return d['calories']; })])
    .range([400, 30]);

  drawBars(svg, data, height, yScale);
  xLabels(svg, data, height);
  yLabels(svg, data, yScale);
  chartTitle(svg)
}

main();
