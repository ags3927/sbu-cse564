function parallel_coordinates_plot_ud(svg, labels, features) {
    d3.csv("../static/data/spotify_top_100.csv", function (e, data) {

        svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 150)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Parallel Coordinates (UD)")

        let g = svg.append("g").attr("transform", "translate(" + 20 + "," + 100 + ")");

        // Only keep the features we want
        data = data.map(function (d) {
            return {
                Tempo: d.Tempo,
                Energy: d.Energy,
                Danceability: d.Danceability,
                Intensity: d.Intensity,
                'Live Likelihood': d['Live Likelihood'],
                Positiveness: d.Positiveness,
                Duration: d.Duration,
                Acoustic: d.Acoustic,
                'Speech Focus': d['Speech Focus'],
                Popularity: d.Popularity
            }
        })

        var color = d3.scaleOrdinal()
            .domain(["versicolor", "virginica"])
            .range(["#21908dff", "#fde725ff"])


        // For each dimension, I build a linear scale. I store all in a y object
        var y = {}
        for (i in features) {
            let name = features[i]

            let maxValue = d3.max(data, function (d) { return Number(d[name]); });
            let minValue = d3.min(data, function (d) { return Number(d[name]); });

            y[name] = d3.scaleLinear()
                .domain([minValue, maxValue]) // --> Same axis range for each group
                // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                .range([400, 0])
        }

        // Build the X scale -> it find the best position for each Y axis
        x = d3.scalePoint()
            .range([0, 650])
            .domain(features);

        // Highlight the specie that is hovered
        var highlight = function (idx) {

            let label = labels[idx]

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")

            // Second the hovered specie takes its color
            d3.selectAll(".c" + label.toString())
                .transition().duration(200)
                .style("stroke", color(label))
                .style("opacity", "1")
        }

        // Unhighlight
        var doNotHighlight = function (idx) {
            let label = labels[idx]
            d3.selectAll(".line")
                .transition().duration(200).delay(1000)
                .style("stroke", color(label))
                .style("opacity", "1")
        }

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(features.map(function (p) { return [x(p), y[p](d[p])]; }));
        }

        // Draw the lines
        g
            .selectAll("myPath")
            .data(data)
            .enter()
            .append("path")
            .attr("class", function (d, i) { return "line " + "c" + labels[i] }) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d, i) { return (color(labels[i])) })
            .style("opacity", 0.5)

        // Draw the axis:
        g.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(features).enter()
            .append("g")
            .attr("class", "axis")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
            // And I build the axis with the call function
            .each(function (d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", "-10px")
            .text(function (d) { return d; })
            .style("fill", "black")
    });

}

function var_mds_scatter_plot_with_pc(svg1, svg2, data, labels) {
    let features_static = [
        'Tempo',
        'Energy',
        'Danceability',
        'Intensity',
        'Live Likelihood',
        'Positiveness',
        'Duration',
        'Acoustic',
        'Popularity',
        'Speech Focus'
    ]

    let features = [
        'Tempo',
        'Energy',
        'Danceability',
        'Intensity',
        'Live Likelihood',
        'Positiveness',
        'Duration',
        'Acoustic',
        'Popularity',
        'Speech Focus'
    ]

    svg1.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 75)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("MDS Plot of variables")

    let g1 = svg1.append("g").attr("transform", "translate(" + 50 + "," + 100 + ")");

    let X_maxValue = d3.max(data, function (d) { return Number(d[0]); });
    let X_minValue = d3.min(data, function (d) { return Number(d[0]); });
    let Y_maxValue = d3.max(data, function (d) { return Number(d[1]); });
    let Y_minValue = d3.min(data, function (d) { return Number(d[1]); });
    let x_eps = (X_maxValue - X_minValue) * 0.1;
    let y_eps = (Y_maxValue - Y_minValue) * 0.1;

    let half_height = 400;
    let half_width = 550;

    let xScale = d3.scaleLinear().range([0, half_width]);
    let yScale = d3.scaleLinear().range([half_height, 0]);

    xScale.domain([X_minValue - x_eps, X_maxValue + x_eps]);
    yScale.domain([Y_minValue - y_eps, Y_maxValue + y_eps]);

    g1.append("g") //Another group element to have our x-axis grouped under one group element
        .attr("transform", "translate(0," + half_height + ")") // We then use the transform attribute to shift our x-axis towards the bottom of the SVG.
        .call(d3.axisBottom(xScale).tickFormat(function (d) { // Try with X Scaling too.
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", 50)
        .attr("x", half_width/2 + 50)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text("Dimension 1");

    g1.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(yScale).tickFormat(function (d) { // Try with X Scaling too.
            return d;
        }).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", "-130px")
        .attr("dy", "-2em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text("Dimension 2");


    g1.selectAll(".circle") //created dynamic bars with our data using the SVG rectangle element.
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function (d) { return xScale(d[0]); })
        .attr("cy", function (d) { return yScale(d[1]); })
        .style("fill", "steelblue")
        .on("click", function (d, i) {
            let feature = features_static[i];
            features.splice(features.indexOf(feature), 1);
            features.push(feature);
            document.getElementById("mysvg2").innerHTML = "";
            parallel_coordinates_plot_ud(svg2, labels, features);
        })
        .append("text")
        .attr("transform", "translate(7,7)")
        .attr("stroke", "black")
        .attr("font-size", "8px")
        .text(function (d, i) { return features_static[i]; });
    
        g1.append("text")
        .attr("transform", "translate(-50,480)")
        .text("Clicking on a point will move the corresponding variable to the end of the parallel coordinates plot.")

    parallel_coordinates_plot_ud(svg2, labels, features);
}