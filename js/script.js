// Get data (outside of d3 so we can make sure d3 only uses the data in this form)
var all_term_keys = []
var data = []
$.getJSON("https://raw.githubusercontent.com/Whole-Earth-Catalog/TermSearchResults/master/data/keys_by_decade.json", function (j_data) {
    // console.log("in json")
    var index = 0;
    var term_key = d.term_key;
    var decade = Number(d.decade);
    var num_ids = +d.num_ids;
    $.each(j_data, function (i, d) {
        
        
    });
});
    
// Define margins
var margin = { top: 50, right: 100, bottom: 100, left: 80 },
    width =
        parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
    height =
        parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;