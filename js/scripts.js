console.log("Beginning js script 8:21")
var term_keys = []
$.getJSON("../TermSearchResults/data/keys_by_decade.json", function (data) {
    console("in json")
    $.each(data, function (d) {
        console.log(d.term_key)
        if ($.inArray(d.term_key, term_keys) === -1) {
            term_keys.push(d.term_key)
        }
    });
});

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
        return xScale(d.decade)
    })
    .y(function (d) {
        return yScale(d.count)
    });
// Define svg canvas
var svg = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define dataset
d3.json("../TermSearchResults/data/keys_by_decade.json", function (data) {
    console.log("reading from json...")
    console.log(data)
    // set color domain
    color.domain(term_keys)
    // format data
    data.forEach(function (d) {
        d.decade = parseYear(d.decade)
        d.num_ids = +num_ids
    });
    var key_data = term_keys.map(function (term) {
        return {
            term_key: term,
            datapoints: data.map(function (d) {
                return { decade: d.decade, count: d.num_ids };
            })
        }
    })
    console.log(key_data)
    // set domain of axes
    xScale.domain(d3.extent(data, function (d) {
        return d.decade;
    }));
    yScale.domain(d3.extent(data, function (d) {
        return d.num_ids;
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
        .data(key_data)
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
        });

});
// Define responsive behavior
function resize() {
    var width =
        parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
        height =
            parseInt(d3.select("#chart").style("height")) -
            margin.top -
            margin.bottom;

    // Update the range of the scale with new width/height
    xScale.range([0, width]);
    yScale.range([height, 0]);

    // Update the axis and text with the new scale
    svg
        .select(".x.axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.select(".y.axis").call(yAxis);

    // Force D3 to recalculate and update the line
    svg.selectAll(".line").attr("d", function (d) {
        return line(d.datapoints);
    });

    // Update the tick marks
    xAxis.ticks(Math.max(width / 75, 2));
    yAxis.ticks(Math.max(height / 50, 2));
}

// Call the resize function whenever a resize event occurs
d3.select(window).on("resize", resize);

// Call the resize function
resize();
console.log("end of script")