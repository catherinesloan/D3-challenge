# D3-challenge

## Data Journalism and D3 - Welcome to the newsroom 

[Click here](https://catherinesloan.github.io/D3-challenge/D3_data_journalism/index.html) to see deployed app.

**If cloning the repository...** 
1. Activate python environment 
2. Run "python -m http.server" in terminal
3. Use 'localhost:8000' to view in browser, otherwise CORS error in index.html file
4. To see part 1 of project - uncomment out  '<script type="text/javascript" src="assets/js/app.js"></script>' in html file
**and** comment out bonus source

### Background: 
As a data analyst for a major metro paper, tasked with analysing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand my findings.

### Task: 
To sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.
The data set included with the assignment is based on [2014 ACS 1-year estimates.](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml)

### Output: 
**Part 1:**
Created [app.js](https://github.com/catherinesloan/D3-challenge/blob/main/D3_data_journalism/assets/js/app.js) using D3 techniques:
1. Pulled in the [data](https://github.com/catherinesloan/D3-challenge/blob/main/D3_data_journalism/assets/data/data.csv) by using the d3.csv function
2. A scatter plot between the two data variables, Healthcare vs. Poverty, where each circle represents each state
3. State abbreviations in the circles

**Part 2:**
With more data, can have more dynamics. Created [bonus.js](https://github.com/catherinesloan/D3-challenge/blob/main/D3_data_journalism/assets/js/bonus.js) to include two risk factors for each axis. 
1. Placed additional labels in the scatter plot and gave them click events. Giving the user the ability to decide which data to display. 
2. Animated the transitions for the circles' locations as well as the range of the axes
3. Used the d3-tip.js plugin to add tooltips to the circles 

_New error at line 403, says yAxis is not defined. Not sure why I am getting this error as I had previously managed to get the y-axis to change successfully. 
Graph changes successfully when I change x-axis but labels are no longer moving with it._

