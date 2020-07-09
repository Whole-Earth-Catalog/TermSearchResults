console.log("Start.")
// Define margins
var margin = { top: 50, right: 100, bottom: 100, left: 80 },
    width =
        parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
    height =
        parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;
// Define scales
var xScale = d3.scaleLinear().range([0, width]);
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
        return xScale(d['decade'])
    })
    .y(function (d) {
        return yScale(d['count'])
    });
// Define svg canvas
var svg = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// open data
d3.json("https://raw.githubusercontent.com/Whole-Earth-Catalog/TermSearchResults/master/data/clean_key_data.json").then(function (data) {
    console.log("d3 opened json")
    all_term_keys = [];
    // format data 
    data.forEach(function (row) {
        all_term_keys.push(row.term_key)
        row.datapoints.forEach(function (d) {
            d.count = +d.count;
            d.decade = +d.decade;
        });
    });
    console.log(data);
    xScale.domain(d3.extent(data, function (d) {
        return d.datapoints['decade'];
    }));
    yScale.domain(d3.extent(data, function (d) {
        return d.datapoints['num_ids'];
    }));
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("dx", ".71em")
        .style("text-anchor", "beginning")
        .text("number of titles");
    var key_lines = svg
        .selectAll(".term_key")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "term_key");
    key_lines
        .append("path")
        .attr("d", function (d) {
            return line(d.datapoints);
        })
        .style("stroke", function (d) {
            return color(d.term_key);
        })
        .attr("fill", "none");
    console.log(data)
});