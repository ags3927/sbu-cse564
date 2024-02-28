function data_mds_scatter_plot(svg, data, labels) {

    svg.append("text")
        .attr("x", 550)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("MDS Plot of data")

    let g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

    colors = ['steelblue', 'red', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'grey', 'black']

    let X_maxValue = d3.max(data, function (d) { return Number(d[0]); });
    let X_minValue = d3.min(data, function (d) { return Number(d[0]); });
    let Y_maxValue = d3.max(data, function (d) { return Number(d[1]); });
    let Y_minValue = d3.min(data, function (d) { return Number(d[1]); });

    let xScale = d3.scaleLinear().range([0, width]);
    let yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain([X_minValue, X_maxValue]);
    yScale.domain([Y_minValue, Y_maxValue]);

    g.append("g") //Another group element to have our x-axis grouped under one group element
        .attr("transform", "translate(0," + height + ")") // We then use the transform attribute to shift our x-axis towards the bottom of the SVG.
        .call(d3.axisBottom(xScale).tickFormat(function (d) { // Try with X Scaling too.
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", height - 450)
        .attr("x", width - 350)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text("Dimension 1");

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
        .attr("font-size", "12px")
        .text("Dimension 2");

    
    g.selectAll(".circle") //created dynamic bars with our data using the SVG rectangle element.
        .data(data)
        .enter().append("circle")
        .attr("r", 2)
        .attr("cx", function (d) { return xScale(d[0]); })
        .attr("cy", function (d) { return yScale(d[1]); })
        .style("fill", function (d, i) { 
            return colors[labels[i]];
        })
}