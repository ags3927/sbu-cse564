function plot_categorical(val, g, data) {

    unique_vals = [...new Set(data.map(item => item[val]))];

    unique_val_frequency = {};

    for (let i = 0; i < unique_vals.length; i++) {
        unique_val_frequency[unique_vals[i]] = 0;
    }

    for (let i = 0; i < data.length; i++) {
        unique_val_frequency[data[i][val]] += 1;
    }
    let show_items = []

    let SHOW_COUNT = 10;

    if (val == 'Top Year' || val == 'Released') {
        SHOW_COUNT = unique_vals.length;
    }

    if (unique_vals.length > SHOW_COUNT) {
        var items = Object.keys(unique_val_frequency).map(function (key) {
            return [key, unique_val_frequency[key]];
        });

        items.sort(function (first, second) {
            return second[1] - first[1];
        });

        show_items = items.slice(0, SHOW_COUNT);

        let merge_items = items.slice(SHOW_COUNT, items.length);

        merge_sum = 0;

        for (let i = 0; i < merge_items.length; i++) {
            merge_sum += merge_items[i][1];
        }
        if (val != 'Artist') show_items.push(["Others", merge_sum]);

    }
    else {
        show_items = Object.keys(unique_val_frequency).map(function (key) {
            return [key, unique_val_frequency[key]];
        });
    }

    let xScale = d3.scaleBand().range([0, width]).padding(0.4);
    let yScale = d3.scaleLinear().range([height, 0]);

    let maxFrequency = d3.max(show_items, function (d) { return d[1]; });

    xScale.domain(show_items.map(function (d) { return d[0]; }));

    yScale.domain([0, maxFrequency]);

    valText = 'Top 10 ' + val;
    g.append("g") //Another group element to have our x-axis grouped under one group element
        .attr("transform", "translate(0," + height + ")") // We then use the transform attribute to shift our x-axis towards the bottom of the SVG.
        .call(d3.axisBottom(xScale)) //We then insert x-axis on this group element using .call(d3.axisBottom(x)).
        .append("text")
        .attr("y", height - 450)
        .attr("x", width - 500)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text(valText);

    g.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(yScale)) //We have also specified the number of ticks we would like our y-axis to have using ticks(10).
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", "-3.1em")
        .attr("x", height - 700)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text("Number of Songs");

    // console.log(Object.values(binCounterMap));

    g.selectAll(".bar") //created dynamic bars with our data using the SVG rectangle element.
        .data(Object.values(show_items))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d[0]); })  //x scale created earlier and pass the year value from our data.
        .attr("y", function (d) { return yScale(d[1]); }) // pass the data value to our y scale and receive the corresponding y value from the y range.
        .attr("width", xScale.bandwidth()) //width of our bars would be determined by the scaleBand() function.
        .attr("height", function (d) { return height - yScale(d[1]); }); //height of the bar would be calculated as height - yScale(d.value)
    //the height of the SVG minus the corresponding y-value of the bar from the y-scale
}

function plot_numerical(val, g, data) {
    let minValue = d3.min(data, function (d) { return Number(d[val]); });
    let maxValue = d3.max(data, function (d) { return Number(d[val]); });

    // console.log("min = ", minValue);
    // console.log("max = ", maxValue);

    bins = 10;
    binSize = (maxValue - minValue) / bins;

    binCounterMap = {};

    let binBorders = [];

    for (let i = 0; i <= bins; i++) {
        idx = (minValue + i * binSize).toFixed(2);
        binBorders.push(idx);
        binCounterMap[idx] = 0;
    }

    for (let i = 0; i < data.length; i++) {
        let bin_idx = Math.floor((data[i][val] - minValue) / binSize);
        let bin = binBorders[bin_idx];
        binCounterMap[bin] += 1;
    }

    // console.log(binCounterMap);
    // console.log(binBorders);

    let xScale = d3.scaleBand().range([0, width]).padding(0.4);
    let yScale = d3.scaleLinear().range([height, 0]);

    maxFrequency = d3.max(Object.values(binCounterMap));

    xScale.domain(binBorders);

    yScale.domain([0, maxFrequency]);

    g.append("g") //Another group element to have our x-axis grouped under one group element
        .attr("transform", "translate(0," + height + ")") // We then use the transform attribute to shift our x-axis towards the bottom of the SVG.
        .call(d3.axisBottom(xScale)) //We then insert x-axis on this group element using .call(d3.axisBottom(x)).
        .append("text")
        .attr("y", height - 450)
        .attr("x", width - 500)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text(val + " Bins");

    g.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(yScale)) //We have also specified the number of ticks we would like our y-axis to have using ticks(10).
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", height - 700)
        .attr("dy", "-3.2em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text("Number of Songs");

    // console.log(Object.values(binCounterMap));

    g.selectAll(".bar") //created dynamic bars with our data using the SVG rectangle element.
        .data(Object.values(binCounterMap))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d, i) { return xScale(binBorders[i]); })  //x scale created earlier and pass the year value from our data.
        .attr("y", function (d, i) { return yScale(d); }) // pass the data value to our y scale and receive the corresponding y value from the y range.
        .attr("width", xScale.bandwidth()) //width of our bars would be determined by the scaleBand() function.
        .attr("height", function (d) { return height - yScale(d); }); //height of the bar would be calculated as height - yScale(d.value)
    //the height of the SVG minus the corresponding y-value of the bar from the y-scale
}

function plot_single_value(val, g, data) {

    categorical_features = ['Artist', 'Genre', 'Released', 'Top Year', 'Artist Type'];
    
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 300)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text(val + " of Spotify top 100 songs")

    if (categorical_features.includes(val)) {
        plot_categorical(val, g, data);
    } else {
        plot_numerical(val, g, data);
    }
}


function scatter_plot(X_feature, Y_feature, g, data) {

    categorical_features = ['Artist', 'Genre', 'Released', 'Top Year', 'Artist Type'];

    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 300)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text(Y_feature + " vs " + X_feature + " of Spotify top 100 songs")

    if (categorical_features.includes(X_feature)) {
        unique_vals = [...new Set(data.map(item => item[X_feature]))];

        for (let i = 0; i < data.length; i++) {
            data[i][X_feature] = unique_vals.indexOf(data[i][X_feature]);
        }
    }

    if (categorical_features.includes(Y_feature)) {
        unique_vals = [...new Set(data.map(item => item[Y_feature]))];

        for (let i = 0; i < data.length; i++) {
            data[i][Y_feature] = unique_vals.indexOf(data[i][Y_feature]);
        }
    }


    let X_minValue = d3.min(data, function (d) { return Number(d[X_feature]); });
    let X_maxXValue = d3.max(data, function (d) { return Number(d[X_feature]); });
    let Y_minValue = d3.min(data, function (d) { return Number(d[Y_feature]); });
    let Y_maxValue = d3.max(data, function (d) { return Number(d[Y_feature]); });

    if (X_feature == 'Intensity') {
        let temp = X_minValue;
        X_minValue = X_maxXValue;
        X_maxXValue = temp;
    }
    if (Y_feature == 'Intensity') {
        let temp = Y_minValue;
        Y_minValue = Y_maxValue;
        Y_maxValue = temp;
    }

    let xScale = d3.scaleLinear().range([0, width]);
    let yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain([0, X_maxXValue]);
    yScale.domain([0, Y_maxValue]);

    g.append("g") //Another group element to have our x-axis grouped under one group element
        .attr("transform", "translate(0," + height + ")") // We then use the transform attribute to shift our x-axis towards the bottom of the SVG.
        .call(d3.axisBottom(xScale).tickFormat(function (d) { // Try with X Scaling too.
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", height - 450)
        .attr("x", width - 500)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text(X_feature);

    g.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(yScale).tickFormat(function (d) { // Try with X Scaling too.
            return d;
        }).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", height - 700)
        .attr("dy", "-3.2em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text(Y_feature);


    g.selectAll(".circle") //created dynamic bars with our data using the SVG rectangle element.
        .data(data)
        .enter().append("circle")
        .attr("r", 2)
        .attr("cx", function (d) { return xScale(d[X_feature]); })
        .attr("cy", function (d) { return yScale(d[Y_feature]); })
        .style("fill", "steelblue")

}

function load_single_feature_selector() {

    d3.csv('spotify_top_100.csv', function (e, d) {
        if (e) {
            throw e;
        }
        headers = d3.keys(d[0]);
        headers.splice(0, 2);

        d3.select('div.d-flex > div').remove();
        d3.select('select#feature_selector').remove();
        d3.select('p.my-auto.mx-3').remove();

        d3.select('div.d-flex')
            .append('p')
            .attr('class', 'my-auto mx-3')
            .text('Select a feature to plot:')

        d3.select('div.d-flex')
            .append('select')
            .attr('id', 'feature_selector')
            .selectAll('option')
            .data(headers)
            .enter()
            .append('option')
            .attr('value', function (d) { return d; })
            .text(function (d) { return d; });

        d3.selectAll("svg > *").remove();

        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        plot_single_value('Artist', g, d);

        d3.select('select#feature_selector')
            .on('change', function () {

                d3.selectAll("svg > *").remove();

                var g = svg.append("g")
                    .attr("transform", "translate(" + 100 + "," + 100 + ")");

                plot_single_value(this.value, g, d);
            })
    });
}

function load_double_feature_selector() {
    d3.csv('spotify_top_100.csv', function (e, d) {
        if (e) {
            throw e;
        }

        headers = d3.keys(d[0]);
        headers.splice(0, 2);


        d3.select('select#feature_selector').remove();
        d3.select('div.d-flex > div').remove();
        d3.select('p.my-auto.mx-3').remove();


        d3.select('div.d-flex')
            .append('p')
            .attr('class', 'my-auto mx-3')
            .text('Select two features to plot:')

        d3.select('div.d-flex')
            .append('div')
            .style('margin-right', '25px')
            .attr('id', 'axis_button')
            .html('<input type="radio" name="axis_button" value="X" checked> X<br>\
                   <input type="radio" name="axis_button" value="Y"> Y<br>')
        let axis = 'X';
        let X_feature = 'Tempo';
        let Y_feature = 'Energy';

        d3.selectAll('#axis_button')
            .on('change', function () {
                axis = d3.select('#axis_button>input:checked').property('value');
                console.log(axis);
            })

        d3.select('div.d-flex')
            .append('select')
            .attr('id', 'feature_selector')
            .selectAll('option')
            .data(headers)
            .enter()
            .append('option')
            .attr('value', function (d) { return d; })
            .text(function (d) { return d; });

        d3.selectAll("svg > *").remove();

        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        scatter_plot(X_feature, Y_feature, g, d);

        d3.select('select#feature_selector')
            .on('change', function () {

                d3.selectAll("svg > *").remove();

                var g = svg.append("g")
                    .attr("transform", "translate(" + 100 + "," + 100 + ")");
                if (axis == 'X') {
                    X_feature = this.value;
                } else {
                    Y_feature = this.value;
                }
                scatter_plot(X_feature, Y_feature, g, d);
            })

    });
}
