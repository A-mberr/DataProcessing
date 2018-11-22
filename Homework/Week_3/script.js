// Name: Amber Nobel
// Student ID: 11819359

function draw(x, y) {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  const graph = {
    ctx: ctx,
    width: 580,
    height: 360,
    title: 'Maximum temperature on my birthday (August 14)',
    margin: {
      left: 80,
      right: 50,
      top: 50,
      bottom: 50
    },
    data: {
      x: x,
      y: y,
    },
    range: {
      x: {
        min: Math.min.apply(this, x),
        max: Math.max.apply(this, x),
      },
      y: {
        min: Math.min.apply(this, y),
        max: Math.max.apply(this, y),
      },
    },
    ratios: [],
  };

  // Pre-compute the data height ratios over the Y-axis.
  graph.ratios = computeRatios(graph, graph.data.y);

  clear(graph);
  drawAxes(graph);
  drawTitle(graph);
  drawYLabels(graph);
  drawXLabels(graph);

  plotLineSegments(graph);
  plotDataPoints(graph);
}

function clear(graph) {
  const {ctx, width, height} = graph;
  // Creates a white rectangular for the graph to be drawn in.
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height)
}

function drawTitle(graph) {
  const {ctx, title, margin} = graph;
  ctx.font = '18px serif';
  ctx.fillStyle = 'black';
  ctx.fillText(title, margin.left + 80, margin.top - 20);
}

function drawAxes(graph) {
  const {ctx, margin, width, height} = graph;
  // Draw Y axis
  ctx.beginPath();
  ctx.strokeStyle = '#aaa';
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, height - margin.bottom);
  ctx.stroke();

  // Draw X axis
  ctx.beginPath();
  ctx.moveTo(margin.left, height - margin.bottom);
  ctx.lineTo((width - margin.right), height - margin.bottom);
  ctx.stroke();
}

function prettyPrint(temp) {
  let rounded = '' + Math.round(temp * 10) / 10;
  if (!rounded.includes('.')) {
     return rounded + '.0';
  }
  return rounded;
}

function drawYLabels(graph) {
  const {ctx, width, height, data, range, margin} = graph;
  ctx.fillStyle = "#333";
  ctx.font = '15px serif';
  ctx.fillText("Time (years)", width - 100, height - 20);

  ctx.font = '10px serif';
  const textWidth = 20;
  const x = margin.left - textWidth;

  const start = range.y.min;
  const end = range.y.max;

  const steps = 6;
  const stepSize = (end - start) / steps

  const textHeight = 10;

  const contentHeight = height - margin.top - margin.bottom - textHeight;
  let y = margin.top + contentHeight + textHeight;

  // Draw the labels on Y axis.
  for (let temp = start; temp <= end; temp += stepSize) {
    ctx.fillText(prettyPrint(temp), x, y);
    y -= contentHeight / steps;
  }
}

function drawXLabels(graph) {
  const {ctx, margin, width, height} = graph;

  ctx.font = '15px serif';
  ctx.fillText("Temp (°C)", 20, margin.top - 10);

  const contentWidth = width - margin.left - margin.right;
  const labels = graph.data.x;
  const step = contentWidth / labels.length;

  // Draw the labels on X axis with abbreviated year notation.
  ctx.font = '10px serif';
  const y = height - margin.bottom + 10;
  let x = margin.left + 5;
  for (let year of labels) {
    ctx.fillText('\'' + ('' + year).substr(2), x, y);
    x += step;
  }
}

function computeRatios(graph, values) {
  const {range} = graph;
  // Map values to ratios. The ratio is from 1 to 0,
  // since we're drawing the graph on the screen from
  // bottom (= 1 * contentHeight) to top (= 0 * contentHeight).
  return values.map(y =>
    1 - (
      (y - range.y.min) / (range.y.max - range.y.min)
    )
  );
}

function plotDataPoints(graph) {
  const {ctx, margin, width, height, ratios} = graph;

  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.bottom - margin.top;
  const step = contentWidth / graph.data.x.length;

  let x = margin.left + 10;

  // Plot points in graph.
  ctx.fillStyle = 'black';
  for (let i = 0; i < ratios.length; i++) {
    let y = margin.top + ratios[i] * contentHeight;
    // Subtract 2 from y to plot the point above the X axis.
    ctx.fillRect(x - 1, y - 2, 3, 3);
    x += step;
  }
}

function drawLineSegment(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = '#fc7878';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);s
  ctx.stroke();
}

function plotLineSegments(graph) {
  const {ctx, data, ratios, width, height, margin} = graph;

  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.bottom - margin.top;
  const step = contentWidth / graph.data.x.length;

  let x1 = margin.left + 10;
  let y1 = margin.top + ratios[0] * contentHeight;

  // Place line segments between tow coordinates and moves on
  // the next coordinate.
  for (let i = 1; i < ratios.length; i++) {
    let x2 = x1 + step;
    let y2 = margin.top + ratios[i] * contentHeight;
    drawLineSegment(ctx, x1, y1, x2, y2);
    y1 = y2;
    x1 = x2;
  }
}

// Transforms the data from json to usable data to draw graph.
fetch('data.json')
.then(res => res.json())
.then(data => {
  let x = Object.keys(data).map(x => +x);
  let y = x.map(year => data[year].max_temp / 10.);
  draw(x, y);
});
