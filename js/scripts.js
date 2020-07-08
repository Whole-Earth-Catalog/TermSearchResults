// Define margins
var margin = { top: 50, right: 100, bottom: 100, left: 80 },
    width =
        parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
    height =
        parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;