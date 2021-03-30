// // MAKE RESPONSIVE FUNCTION
// function makeResponsive() {

//   // If the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
//   var svgArea = d3.select("body").select("svg");

//   if (!svgArea.empty()) {
//     svgArea.remove();
//   }

//   // SET UP CHART
//   var svgHeight = window.innerHeight;
//   var svgWidth = window.innerWidth;

//   // To log out at the console what the height and width of the svg container is when the broswer is resized
//   console.log("svgHeight", svgHeight);
//   console.log("svgWidth", svgWidth);

// SET UP CHART don't need if making responsive
var svgWidth = 960;
var svgHeight = 500;

// MARGINS
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

// CHART AREA MINUS MARGINS
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// CREATE AN SVG CONTAINER
var svg = d3.select("#scatter") 
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// APPEND AN SVG GROUP - SHIFT EVERYTHING OVER BY THE MARGINS
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// FUNCTIONS FOR X VALUES AND X AXIS
// poverty, age and household income

// Initial Parameter
var chosenXAxis = "poverty";

// Function used for updating x-scale variable upon click on axis label
function xScale(censusData, chosenXAxis) {
// CREATE X SCALE
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8, // [] instead of dot notation. dot notation need to know ahead of time
      d3.max(censusData, d => d[chosenXAxis]) * 1.2 
    ])
    .range([0, chartWidth]);
    
  return xLinearScale;
}

// Function used for updating xAxis variable upon click on axis label
function renderXAxis(newXScale, xAxis) {
  // CREATE X AXIS
  var bottomAxis = d3.axisBottom(newXScale);
  
  xAxis.transition()
    .duration(1000) // ** 1000 = 1 second
    .call(bottomAxis);
    
    return xAxis;
}


// FUNCTIONS FOR Y VALUES AND Y AXIS
// healthcare, obese, smokers

// Initial Parameter
var chosenYAxis = "healthcare";

// Function used for updating y-scale variable upon click on axis label
function yScale(censusData, chosenYAxis) {
  // CREATE Y SCALE
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8, // [] instead of dot notation. dot notation need to know ahead of time
        d3.max(censusData, d => d[chosenYAxis]) * 1.2 
      ])
      .range([chartHeight, 0]);
      
    return yLinearScale;
  }
  
  // Function used for updating y Axis variable upon click on axis label
  function renderYAxis(newYScale, yAxis) {
    // CREATE Y AXIS
    var leftAxis = d3.axisLeft(newYScale);
    
    yAxis.transition()
      .duration(1000) // ** 1000 = 1 second
      .call(leftAxis);
      
    return yAxis;
  }

// FUNCTION used for updating circles group with a transition to new circles when different axes are selected
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis])) // changes the position 
    .attr("cy", d => newYScale(d[chosenYAxis]));
    
    return circlesGroup;
  }

// FUNCTION used for updating circle labels with a transition to new circles when different axes are selected
function renderCircleLabels(circleLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
  circleLabels.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
    
    return circleLabels;
  }



// FUNCTION used for updating circles group with new tooltip 
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // defining variable so that the tooltip can display these values
  var xLabel; 
  var yLabel;

  // if statement to determine the outcomes of the X axis and therefore what should be displayed in tooltip
  if (chosenXAxis === "poverty") {
    xLabel = "Poverty(%)";
  }
  else if (chosenXAxis === "income") {
    xLabel = "Household Income(median)";
  }
  else if (chosenXAxis === "age") {
    xLabel = "Age(median)";
  };

  // if statement to determine the outcomes of the Y axis 
  if (chosenYAxis === "healthcare") {
    yLabel = "Healthcare(%)";
  }
  else if (chosenYAxis === "obesity") {
    yLabel = "Obesity(%)";
  }
  else if (chosenYAxis === "smokes") {
    yLabel = "Smokes(%)";
  };
  
  // defining the tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([60, 0])
    .html(function(d) {
      return (`${d.state} <br> ${xLabel} : ${d[chosenXAxis]} <br> ${yLabel} : ${d[chosenYAxis]}`);
    });
    
  circlesGroup.call(toolTip);
  
  // onmouseover event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this); 
  })
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

return circlesGroup;
}



// IMPORT DATA, data is read in as string
d3.csv("/assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;
  // Convert data to numerical values
  censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.income = +data.income;
      data.age = +data.age;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      console.log(data); // to check conversion of data
  })

  // Creating Scale functions from above 
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Append y axis
  chartGroup.append("g")
    .call(leftAxis);
  // AXES NOW APPEAR IN BROWSER

  // Append initial circles
  var circlesGroup = chartGroup.selectAll(".stateCircle") // applying class here
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", data => xLinearScale(data[chosenXAxis])) // positioning of circles - depending on what axis is selected, passing that data throughlinear scale functions defined above to get new positions
    .attr("cy", data => yLinearScale(data[chosenYAxis]))  
    .attr("r", 15)
    .attr("opacity", ".5")
    .attr("class", "stateCircle");

  // CREATE LABELS - state abbreviations in circles
  var circleLabels = chartGroup.selectAll(".stateText") // have to apply class here or only half labels appear
    .data(censusData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr);


  // Create group for X axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
  
  // APPEND X AXIS LABELS

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .attr("class", "aText")
    .classed("active", true)
    .text("In Poverty (%)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Income (median)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Age (median)");


  // Create group for Y axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr('transform', `translate(${0 - margin.left/4}, ${chartHeight/2})`);

  // APPEND Y AXIS LABELS
  var healthcareLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)") // rotates the label so it's perpendicular to y axis
    .attr("y", 0 - 20)
    .attr("x", 0)
    .attr("value", "healthcare") // value to grab for event listener
    .attr("class", "aText") // attribute in d3Style.css
    .classed("active", true)
    .attr("dy", "1em")
    .text("Lacks Healthcare (%)");

  var obesityLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)") // rotates the label so it's perpendicular to y axis
    .attr("y", 0 - 40)
    .attr("x", 0)
    .attr("value", "obesity") // value to grab for event listener
    .attr("class", "aText") // attribute in d3Style.css
    .classed("inactive", true)
    .attr("dy", "1em")
    .text("Obesity (%)");
  
    
  var smokesLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)") // rotates the label so it's perpendicular to y axis
    .attr("y", 0 - 60)
    .attr("x", 0)
    .attr("value", "smokes") // value to grab for event listener
    .attr("class", "aText") // attribute in d3Style.css
    .classed("inactive", true)
    .attr("dy", "1em")
    .text("Smokes (%)");


  // UpdateToolTip function defined above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


  // EVENT LISTENERS

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      console.log(`chosen X axis: ${chosenXAxis}`)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(censusData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxis(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates circles with new circle labels
      circleLabels = renderCircleLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      // have to do all 3 options
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else if (chosenXAxis === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  }); // end of x axis labels event listener

  // Y axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(`chosen Y axis: ${chosenYAxis}`)

      // functions here found above csv import
      // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

      // updates y axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

      // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates circles with new circle labels
        circleLabels = renderCircleLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change to bold text
      // have to do all 3 options
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
    }

    else if (chosenYAxis === "obesity") {
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
    }

    else if (chosenYAxis === "smokes") {
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});

}).catch(function(error) {
console.log(error);
}); 


// } // end of resposive function
// makeResponsive();
// // Event listener for window resize - when the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);