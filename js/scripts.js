console.log("Beginning js script")
// Get list of all term keys from json
var all_term_keys = []
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
// console.log(all_term_keys)

// function to add checkbox/legend option for a given term
function add_option(term) {
    // get form object
    var form = document.getElementById("key_options");
    // console.log("adding option")
    // add input tag 
    var new_key_input = document.createElement("INPUT");
    new_key_input.id = term + "Option"
    new_key_input.type = "checkbox";
    new_key_input.name = "dataset";
    new_key_input.value = term;
    // add label tag
    var key_label = document.createElement("LABEL");
    key_label.className = "term_label"
    key_label.htmlFor = term + "Option"
    key_label.innerHTML = term[0].toUpperCase() + term.slice(1);
    // create svg for rectangle
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttributeNS(null, 'width', '15px')
    svg.setAttributeNS(null, 'height', '15px');
    // create rectangle
    var color_rect = document.createElementNS(ns, 'rect');
    color_rect.setAttributeNS(null, 'width', '15px')
    color_rect.setAttributeNS(null, 'height', '15px')
    color_rect.setAttributeNS(null, 'fill', color(term))
    // add rectangle as child of svg
    svg.appendChild(color_rect)
    // insert break at the end of the form
    form.insertBefore(document.createElement("BR"), null);
    //insert svg before the end of the form
    form.insertBefore(svg, null)
    // insert label before svg
    form.insertBefore(key_label, svg);
    // insert check box before label
    form.insertBefore(new_key_input, key_label)
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
var color = d3.scaleOrdinal().range(["#1cd61c", "#9511fc", "#d01301", "#15c7ff", "#6b6b2f", "#a34588", "#f7a90b", "#22d19e", "#0461df", "#faa293", "#aec333", "#63677a", "#c2adf9", "#ce0256", "#b612b7", "#a6bfa7"]);
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
    var term_keys = all_term_keys;
    // console.log("reading from json...")
    // add options to check box form
    all_term_keys.forEach(add_option);
    // set color domain
    color.domain(term_keys);
    // format data types
    data.forEach(function (d) {
        d.decade = Number(d.decade);
        d.num_ids = +d.num_ids;
    });
    // function to get data only from selected terms and decades in a useful structure
    function clean_data(term_key_list, min_decade, max_decade) {
        var key_data = [];
        // iterate through given term keys
        term_key_list.forEach(function (key) {
            datapoints = [];
            // iterate through data and push rows matching the term and decade
            data.forEach(function (item) {
                if (key == item.term_key && !isNaN(item.decade)
                    && item.decade >= min_decade && item.decade <= max_decade) {
                    datapoints.push({ "decade": item.decade, "count": item.num_ids });
                }
            })
            // push data for each term key to the clean dictionary
            key_data.push({ "term_key": key, "datapoints": datapoints });
        })
        console.log(key_data);
        return key_data;
    }
    
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
        var min_decade = document.getElementById('min_decade').value;
        var max_decade = document.getElementById('max_decade').value;
        // check if min_decade value is between 1500-1800
        if (min_decade > stan_max_decade || min_decade < stan_min_decade) {
            min_decade = stan_min_decade;
            document.getElementById('min_decade_text').innerHTML = "INVALID: enter decade between 1500 and 1800";
        }
        // check if max_decade value is between 1500-1800
        if (max_decade > stan_max_decade || max_decade < stan_min_decade) {
            max_decade = stan_max_decade;
            document.getElementById('max_decade_text').innerHTML = "INVALID: enter decade between 1500 and 1800";
        }
        // check if max_decade is less than or equal min_decade 
        if (max_decade <= min_decade) {
            min_decade = stan_min_decade;
            max_decade = stan_max_decade;
            document.getElementById('max_decade_text').innerHTML = "INVALID: enter decade greater than min decade";
        } else {
            document.getElementById('max_decade_text').innerHTML = "Enter value between 1500 and 1800";
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
    // handle update button
    document.getElementById("update_button").addEventListener("click", function () {
        // console.log("update button pushed!")
        var new_list = []
        var boxes = document.getElementById("key_options")
        // get a list of all check boxes
        var boxes_checked = []
        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].checked) {
                // console.log(boxes[i].value)
                boxes_checked.push(boxes[i].value);
            }
        }
        // if all terms is checked then the list should have all of the terms
        if (boxes_checked[0] == "AllTerms" || boxes_checked.length == 0) {
            new_list = term_keys;
        } else {
            // only the checked terms are passed in the update
            new_list = boxes_checked;
        }
        //console.log(new_list);
        update(new_list);
    });
    // handle reset button
    document.getElementById("reset_button").addEventListener("click", function () {
        // update range for count
        update_title_range(stan_max_titles);
        // update text box for count
        update_count_text(stan_max_titles);
        // update min_decade and max_decade
        document.getElementById('min_decade').value = stan_min_decade;
        document.getElementById('max_decade').value = stan_max_decade;
        // update select boxes
        var select_boxes = document.getElementById("key_options");
        for (var i = 0; i < select_boxes.length; i++) {
            select_boxes[i].checked = false;
        }
        select_boxes[0].checked = true;
        // draw new graph
        update(term_keys);
    });
    // draw first graph
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