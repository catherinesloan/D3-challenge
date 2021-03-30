// MAKE RESPONSIVE FUNCTION
function makeResponsive() {

  // If the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SET UP CHART
  var svgHeight = window.innerHeight;
  var svgWidth = window.innerWidth;

  // To log out at the console what the height and width of the svg container is when the broswer is resized
  console.log("svgHeight", svgHeight);
  console.log("svgWidth", svgWidth);

  // MARGINS
  var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 50
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

  // Initial Params
  var chosenXAxis = "poverty";

  // Function used for updating x-scale variable upon click on axis label
  function xScale(censusData, chosenXAxis) {
  // CREATE X SCALE
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8, // ** [] instead of dot notation. dot notation need to know ahead of time
        d3.max(censusData, d => d[chosenXAxis]) * 1.2 // ** what should 1.2 be
      ])
      .range([0, chartWidth]);
      
    return xLinearScale;
  }

  // Function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    // CREATE X AXIS
    var bottomAxis = d3.axisBottom(newXScale);
    
    xAxis.transition()
      .duration(1000) // ** 1000 = 1 second
      .call(bottomAxis);
      
      return xAxis;
  }

  // Function used for updating circles group with a transition to new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
      
      return circlesGroup;
    }

  // Function used for updating circles group with new tooltip ****** could add more labels
  function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
      label = "Poverty(%)";
    }
    else {
      label = "Age(median)";
    }
    
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([60, 0])
      .html(function(d) {
        return (`${d.state}<br>${label} : ${d[chosenXAxis]}`);
      });
      
    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
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
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        console.log(data); // to check conversion of data
    });

    // xLinearScale function from above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function *****
    maxY = d3.max(censusData, d => d.healthcare);
    console.log(maxY);

    var yLinearScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([chartHeight, 0]);

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
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.healthcare)) // ** would change 
      .attr("r", 15)
      .attr("opacity", ".5")
      .classed("stateCircle", true);

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
      // ** add attribute for labels from css here?

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (median)");

    // Append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "aText") // attribute in d3Style.css
      .text("Lacks Healthcare (%)");

    // UpdateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);



    // x axis labels event listener
    labelsGroup.selectAll("text")
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
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          }
        }
      }); // end of x axis labels event listener
      
    }).catch(function(error) {
      console.log(error);

  }); 


} // end of resposive function
makeResponsive();
// Event listener for window resize - when the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);