console.log("Beginning js script 8:37")
// Get list of all term keys from json
var all_term_keys = Array(20)
$.getJSON("https://raw.githubusercontent.com/Whole-Earth-Catalog/TermSearchResults/master/data/keys_by_decade.json", function (data) {
    // console.log("in json")
    var index = 0;
    $.each(data, function (i, d) {
        if ($.inArray(d.term_key, all_term_keys) === -1) {
            all_term_keys[index] = d.term_key;
            index++;
        }
    });
});
console.log(all_term_keys)
// Create form with label for each term key
var form = document.getElementById("key_options");

function add_option(term){
    console.log("adding option")
    var new_key_input = document.createElement("INPUT");
    new_key_input.id = term + "Option"
    new_key_input.type = "checkbox";
    new_key_input.name = "dataset";
    new_key_input.value = term;
    var key_label = document.createElement("LABEL");
    key_label.htmlFor = term + "Option"
    key_label.innerHTML = term + " ";
    form.insertBefore(document.createElement("BR"), null);
    form.insertBefore(new_key_input, null);
    form.insertBefore(key_label, new_key_input)
}

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


// Draw graph from json
d3.json("https://raw.githubusercontent.com/Whole-Earth-Catalog/TermSearchResults/master/data/keys_by_decade.json").then(function (data) {
    var term_keys = all_term_keys
    console.log("reading from json...")
    // set color domain
    color.domain(term_keys)
    // format data
    data.forEach(function (d) {
        d.decade = Number(d.decade)
        d.num_ids = +d.num_ids
    });
    function clean_data(term_key_list) {
        var key_data = []
        term_key_list.forEach(function (key) {
            datapoints = []
            data.forEach(function (item) {
                if (key == item.term_key && !isNaN(item.decade)) {
                    datapoints.push({ "decade": item.decade, "count": item.num_ids })
                }
            })
            key_data.push({ "term_key": key, "datapoints": datapoints })
        })
        console.log(key_data)
        return key_data
    }
    all_term_keys.forEach(add_option);
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
    
    function update(selected_term_keys) {
        console.log("updating...");
        var new_key_data = clean_data(selected_term_keys);
        svg.selectAll(".line").remove();
        var key_lines = svg
            .selectAll(".line")
            .data(new_key_data)
            .enter()
            .append("g")
            .attr("class", "line");
        key_lines
            .append("path")
            .attr("d", function (d) {
                return line(d.datapoints);
            })
            .style("stroke", function (d) {
                return color(d.term_key);
            })
            .attr("fill", "none");
        
    }
    update(term_keys)
    var new_list = ['violence', 'state']
    document.getElementById("update_button").addEventListener("click", function () {
        console.log("button pushed!")
        document.getElementById("key_options")
        update(new_list)
    })
});


console.log("end of script")