function parallel_coordinates_plot(svg, labels) {
    d3.csv("../static/data/spotify_top_100.csv", function (e, data) {

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
        svg.append("text")
            .attr("transform", "translate(100, 0)")
            .attr("x", 400)
            .attr("y", 50)
            .attr("font-size", "24px")
            .text("Parallel Coordinates Plot")
        
        let g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");
        
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
                .range([height, 0])
        }

        // Build the X scale -> it find the best position for each Y axis
        x = d3.scalePoint()
            .range([0, width])
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
            .attr("class", function (d, i) { return "line " +  "c" + labels[i]}) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d, i) { return (color(labels[i])) })
            .style("opacity", 0.5)
            // .on("mouseover", function (d, i) { highlight(i) })
            // .on("mouseleave", function (d, i) { doNotHighlight(i) })

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
            .style("font-size", 15)
            .attr("y", "-10px")
            .text(function (d) { return d; })
            .style("fill", "black")
    });

}