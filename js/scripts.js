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
var margin = { top: 50, right: 100, bottom: 100, left: 120 },
    width =
        parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
    height =
        parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;
// Define scales
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal().range(d3.schemeCategory10);
// Define axes
var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
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
    var stan_max_titles = 25000;
    var stan_min_decade = 1500;
    var stan_max_decade = 1800;
    var term_keys = all_term_keys
    console.log("reading from json...")
    // set color domain
    color.domain(term_keys)
    // format data
    data.forEach(function (d) {
        d.decade = Number(d.decade)
        d.num_ids = +d.num_ids
    });
    // get data only from selected terms and decades
    function clean_data(term_key_list, min_decade, max_decade) {
        var key_data = []
        term_key_list.forEach(function (key) {
            datapoints = []
            data.forEach(function (item) {
                if (key == item.term_key && !isNaN(item.decade)
                    && item.decade >= min_decade && item.decade <= max_decade) {
                    datapoints.push({ "decade": item.decade, "count": item.num_ids })
                }
            })
            key_data.push({ "term_key": key, "datapoints": datapoints })
        })
        console.log(key_data)
        return key_data
    }
    // add options to check box form
    all_term_keys.forEach(add_option);
    
    // function to draw graph based on selected term keys and scales
    function update(selected_term_keys) {
        console.log("updating...");
        // get value for y scale
        var yMax = document.getElementById('count_value').value
        // update domain of y scale
        yScale.domain([0, yMax]);
        // remove old y axis
        svg.selectAll(".y.axis").remove();
        // add y axis
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
        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 29 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Titles with Term");
        // get value for x axis domain
        var min_decade = document.getElementById('min_decade').value
        var max_decade = document.getElementById('max_decade').value
        // check if min_decade value is between 1500-1800
        if (min_decade > stan_max_decade || min_decade < stan_min_decade) {
            min_decade = stan_min_decade
            document.getElementById('min_decade_text').innerHTML = "invalid: enter decade between 1500 and 1800"
        }
        // check if max_decade value is between 1500-1800
        if (max_decade > stan_max_decade || max_decade < stan_min_decade) {
            max_decade = stan_max_decade
            document.getElementById('max_decade_text').innerHTML = "invalid: enter decade between 1500 and 1800"
        }
        // check if max_decade is less than or equal min_decade 
        if (max_decade <= min_decade) {
            min_decade = stan_min_decade
            max_decade = stan_max_decade
            document.getElementById('max_decade_text').innerHTML = "invalid: enter decade greater than min decade"
        }
        // update x scale domain
        xScale.domain([min_decade, max_decade]);
        // remove old x axis
        svg.selectAll(".x.axis").remove();
        // add x axis
        svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top) + ")")
            .style("text-anchor", "middle")
            .text("Decade");
        // get new data
        var new_key_data = clean_data(selected_term_keys, min_decade, max_decade);
        // remove old lines
        svg.selectAll(".line").remove();
        // add new lines
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
    
    document.getElementById("update_button").addEventListener("click", function () {
        console.log("update button pushed!")
        var new_list = []
        var boxes = document.getElementById("key_options")
        var boxes_checked = []
        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].checked) {
                console.log(boxes[i].value)
                boxes_checked.push(boxes[i].value);
            }
        }
        if (boxes_checked[0] == "AllTerms") {
            new_list = term_keys;
        } else {
            new_list = boxes_checked;
        }
        console.log(new_list);
        update(new_list);
    });
    document.getElementById("reset_button").addEventListener("click", function () {
        // update range for count
        update_title_range(stan_max_titles);
        // update text box for count
        update_count_text(stan_max_titles);

        update(term_keys);
    });
    update(term_keys);
});
// update value in text box when range input is edited
function update_title_range(val) {
    document.getElementById('count_value').value = val;
}
// update value on range to match type input in text box
function update_count_text(val) {
    document.getElementById('count').value = val;
}

console.log("end of script")