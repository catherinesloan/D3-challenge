// 1: SET UP CHART
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// 2: CREATE AN SVG WRAPPER
// Append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter") // html file has id of scatter
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 3: IMPORT DATA, data is read in as string
d3.csv("/assets/data/data.csv").then(function(censusData) {
    // console.log(censusData); // to check data has been read in

    // Convert data to numerical values
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log(data); // to check conversion of data
    });

    // 4: CREATE SCALE FUNCTIONS - required before you can create axes
    // Domain = actual values that exist in data R
    // Range = range of value you want your doamin to be mapped to

    // Calculate max values
    maxY = d3.max(censusData, d => d.healthcare);
    console.log(maxY);
    maxX = d3.max(censusData, d => d.poverty);
    console.log(maxX);

    // 8 otherwise lots of blank space in chart
    // + 1 otherwise x axis stops at 21 but max value is 21.5
    var xLinearScale = d3.scaleLinear()
      .domain([8, (maxX + 1)]) 
      .range([0, chartWidth]);

    // + 2 otherwise x axis stops at 24 but max value is 24.9
    var yLinearScale = d3.scaleLinear()
      .domain([0, (maxY + 2)]) 
      .range([chartHeight, 0]);

    // 5: CREATE AXIS FUNCTIONS
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale); // can add .ticks(10); to change number of ticks on axes

    // 6: APPEND AXES TO THE CHART
    // Translate the X axis by (0, chartHeight)
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    // The axes now appear in browser

    
    // wrap circles and texts inside a <g> with:
    // https://stackoverflow.com/questions/36954426/adding-label-on-a-d3-scatter-plot-circles
    var circlesGroup =  chartGroup.selectAll("g.dot")
        .data(censusData)
        .enter()
        .append('g');

    // 7: CREATE CIRCLES
    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d.poverty)) // cx cy placement
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15") // r is radius
        .attr("opacity", ".5")
        .classed("stateCircle", true); // attribute from d3Style.css - changed to pink

    // 8: CREATE LABELS - state abbreviations in circles
    circlesGroup.append("text")
    .attr("class", "stateText") // attribute from d3Style.css
    .text(function(data){
        return data.abbr; // what is displayed in circle
    })
    .attr("x", function (data) {
        return xLinearScale(data.poverty); // placement
    })
    .attr("y", function (data) {
        return yLinearScale(data.healthcare - 0.3); // placement -0.3 moved it down a bit
    });

    // 9: INITIALISE TOOLTIP - not part of assignment
    // added src to html file
    var toolTip = d3.tip()
      .attr("class", "d3-tip") // attribute from d3Style.css - I changed styling
      .offset([60, 0]) // moved placement of tooltip below the circle
      .html(function(d) {
        return (`${d.state} <br> Poverty: ${d.poverty}% <br> Healthcare: ${d.healthcare}%`); // this is the text in the tooltip
      });
    // CREATE TOOLTIP IN THE CHART
    chartGroup.call(toolTip);
    // CREATE EVENT LISTENERS - to display and hide the tooltip
    // on mouseover event, could be on click
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // on mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // 10: CREATE AXES LABELS
    chartGroup.append("text")
      .attr("transform", "rotate(-90)") // moves the y axis label 
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em") // how much spacing
      .attr("class", "aText") // attribute in d3Style.css
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`) // will put it half way along x axis
      .attr("class", "aText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);

}); // end of reading in data

