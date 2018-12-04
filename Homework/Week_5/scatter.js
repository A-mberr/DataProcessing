window.onload = function() {

  let p1 = d3.json("msti.json");
  let p2 = d3.json("consConf.json");

  Promise.all([p1, p2]).then(response => {
    const w = 1000;
    const h = 500;
    const padding = 50;

  // let [p1, p2] = response;

  // console.log(response)

  // Select the svg for the graph
  var svg = d3.select("body")
            .append("svg")
            .attr("width", w + padding)
            .attr("height", h + padding)
            .attr('style', 'background: #fff');

  // Create the Scale we will use for the xAxis
  var xScale = d3.scaleLinear()
                    .domain([0, w])
                    .range([0, h + 200]);

  var xScale = d3.scaleLinear()
     .domain([2006, 2015])
     .range([padding, w - padding * 2]);

  // Create the Axis
  var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks([11]);

  svg.append("g")
     .attr("transform", "translate(0, 450)")
     .call(xAxis);

  // Create the Scale we will use for the yAxis
  var yScale = d3.scaleLinear()
              // .domain([0, d3.max(response[0], d => {return d.datapoint; })])
              .domain([0, 100])
              .range([h - padding, padding]);

  // Create the yAxis
  var yAxis = d3.axisLeft()
                .scale(yScale);

  svg.append("g")
     .call(yAxis)
     .attr("transform", "translate(50, 0)");





  // // Plot the coordinates of the data
  // var dots = svg.selectAll("circle")
  //   .data(response[0])
  //   .enter()
  //   .append("circle")
  //   .attr("cx", d => {
  //      return xScale(d.time);
  //   })
  //   .attr("cy", d => {
  //        return yScale(d.datapoint);
  //   })
  //   .attr("r", 3)
  //   .attr("fill", "pink");

// function updateData{}
// Change data output through dropdown
  // Remove
  // dots.exit().remove();
  //
  // // // Add
  // dots.enter().append('circle').style('fill', 'blue')
  //    .data(response[1])
  //     .attr("cx", d => {
  //       return xScale(d.time);
  //    })
  //    .attr("cy", d => {
  //       return yScale(d.datapoint);
  //    })
  //    .attr("r", 3)
  //    .attr("fill", "blue");

  console.log(response[1])

  var dots = svg.selectAll("circle")
     .data(response[1])
     .enter()
     .append("circle")
     .attr("cx", d => {
        return xScale(d.time);
     })
     .attr("cy", d => {
          return yScale(d.datapoint);
     })
     .attr("r", 3)
     .attr("fill", "blue");


  // Drawing the legend
  // legend = svg.append("g")
  //   .attr("class","legend")
  //   .attr("transform","translate(50,30)")
  //   .attr("data-legend", d => { return d["MSTI Variables"]})
  //   .style("font-size","12px")
  //   .call(d3.legend);

// function updateData() {

  // d3.select("body").append("button")
  //    .text("change data")
  //    .on("click",function(){
  //        //select new data
  //        if (response[0]) {
  //            response[1];
  //        } else   {
  //            response[0];
  //        }
  //        //rejoin data
  //        var circle = svg.select("g").selectAll("circle")
  //            .data(eval("response"+1));
  //
  //        circle.exit().remove();//remove unneeded circles
  //        circle.enter().append("circle")
  //            .attr("r",0);//create any new circles needed
  //             });

  // var select = d3.select('body').append('select')
  //

  // var dataIndex = 0;
  //
  // var options = select
  //   .selectAll('option')
  // 	.data(menu)
  //   .enter()
  // 	.append('option')
  // 		.text(function (d) { return d; })
      // .on("click",function(){
      //     //select new data
      //     if (response[0]) {
      //         response[1];
      //     } else   {
      //         response[0];
      //     }
      //     // var circle = svg.select("g").selectAll("circle")
      //     //               .data(eval("dataArray"+dataIndex));
      //     //
      //     //           circle.exit().remove();//remove unneeded circles
      //     //           circle.enter().append("circle")
      //     //               .attr("r",0);//create any new circles needed

      // .on("click", function() {


      // d3.select("select")
      //           .on("click", function() {
      //             Remove
      //             dots.exit().remove()
      //             svg.selectAll("circle")
      //                .data(response[1])
      //                .enter()
      //                .append("circle")
      //                .attr("cx", d => {
      //                   return xScale(d.time);
      //                })
      //                .attr("cy", d => {
      //                     return yScale(d.datapoint);
      //                })
      //                .attr("r", 3)
      //                .attr("fill", "blue");
      //              })

      // var dataIndex = 0;
      // var xBuffer = 50;
      // var yBuffer = 150;
      //
      // d3.select("body").append("button")
      //                 .text("Other dataset")
      //                 .on("click",function(){
      //                   //select new data
      //               if (dataIndex==1) {
      //                   dataIndex=2;
      //               } else   {
      //                   dataIndex=1;
      //               }
      //               //rejoin data
      //               var dots = svg.select("g").selectAll("circle")
      //                   .data(eval(response[dataIndex]))
      //
      //               dots.exit().remove();//remove unneeded circles
      //
      //               dots.enter().append("circle")
      //                   .attr("r",0);//create any new circles needed
      //
      //               //update all circles to new positions
      //               circle.transition()
      //                   .duration(500)
      //                   .attr("cx",function(d,i){
      //                       var spacing = lineLength/(eval(response[dataIndex]).length);
      //                       return xBuffer + (i * spacing)
      //                   })
      //                   .attr("cy",yBuffer)
      //                   .attr("r",function(d,i){return d});
      //
      //               d3.select("text").text("dataset"+dataIndex);
      //
      //           });//end click function
  var menu = ["Women researchers as a percentage of total researchers", "Consumer confindence"];

  var buttons = d3.select("body")
                .selectAll("button")
                .data(menu)
                .enter()
                .append("button")
                .text(function(d) {
                  return d;
                });

          buttons.on("click", function(d){
              d3.select(this)
              .transition()
              .duration(500)
              .stule("background", "green")
          });



    d3.select("body").append("p").text("http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015");
    d3.select("body").append("p").text("http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015");

}).catch(function(e){
    throw(e);
});


};
