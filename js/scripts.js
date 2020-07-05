console.log("Beginning js script")
// Define margins
var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    width =
        parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
    height =
        parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;
// Parse the year
var parseYear = d3.timeParse("%Y");
// Define scales
var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal().range(d3.schemeCategory10);
// Define axes
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);
// Define lines
var line = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
        return xScale(d["decade"])
    })
    .y(function (d) {
        return yScale(d["num_ids"])
    });
// Define svg canvas
var svg = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define dataset
d3.json("/TermSearchResults/data/keys_by_decade.json", function (data) {
    console.log("reading from json...")
    console.log(data)
    // set color domain

    // format data
    data.forEach(function (d) {
        d.decade = parseYear(d.decade)
        d.num_ids = +num_ids
    });
    

});