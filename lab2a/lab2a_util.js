function z_score_normalize_data(data) {
    // calculate means per column from array of data
    let means = [];
    for (let i = 0; i < data[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < data.length; j++) {
            sum += Number(data[j][i]);
        }
        means.push(sum / data.length);
    }

    // calculate standard deviations per column from array of data
    let standard_deviations = [];
    for (let i = 0; i < data[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < data.length; j++) {
            sum += (Number(data[j][i]) - means[i]) * (Number(data[j][i]) - means[i]);
        }
        standard_deviations.push(Math.sqrt(sum / data.length));
    }

    // normalize data
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            data[i][j] = (Number(data[i][j]) - means[j]) / standard_deviations[j];
        }
    }
    return data;
}

function data_to_array(data, numerical_headers) {
    arr = []
    for (let i = 0; i < data.length; i++) {
        let row = [];
        for (let j = 0; j < numerical_headers.length; j++) {
            row.push(Number(data[i][numerical_headers[j]]));
        }
        arr.push(row);
    }
    return arr;
}

function plot_categorical(g, eigenvalues) {
    let explainedVariances = [];
    let sum = 0;
    for (let i = 0; i < eigenvalues.length; i++) {
        sum += eigenvalues[i];
    }
    cum_sum = 0;

    let threshold = Number(d3.select("div#d_i").text())
    
    // console.log(threshold);

    let bars_to_highlight = 0;

    for (let i = 0; i < eigenvalues.length; i++) {
        cum_sum += eigenvalues[i];
        if (cum_sum * 100 / sum < threshold) {
            bars_to_highlight = bars_to_highlight + 1;
        }
        explainedVariances.push(cum_sum * 100 / sum);
    }

    // console.log(bars_to_highlight);

    let xEigenvalueScale = d3.scaleBand().range([0, width]).padding(0.4);
    let xExplainedVarianceScale = d3.scaleBand().range([0, width]).padding(0.4);

    let yEigenvalueScale = d3.scaleLinear().range([height, 0]);
    let yExplainedVarianceScale = d3.scaleLinear().range([height, 0]);

    PC_list = [];
    for (let i = 0; i < eigenvalues.length; i++) {
        PC_list.push("PC" + (i + 1));
    }

    xEigenvalueScale.domain(PC_list);
    xExplainedVarianceScale.domain(PC_list);

    yEigenvalueScale.domain([0, eigenvalues[0] * 2]);
    yExplainedVarianceScale.domain([0, 100]);

    g.append("g") //Another group element to have our x-axis grouped under one group element
        .attr("transform", "translate(0," + height + ")") // We then use the transform attribute to shift our x-axis towards the bottom of the SVG.
        .call(d3.axisBottom(xEigenvalueScale)) //We then insert x-axis on this group element using .call(d3.axisBottom(x)).
        .append("text")
        .attr("y", height - 450)
        .attr("x", width - 400)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text('Principal Components');

    g.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(yEigenvalueScale)) //We have also specified the number of ticks we would like our y-axis to have using ticks(10).
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", "-3.1em")
        .attr("x", height - 700)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text("Eigenvalues");

    g.append("g") //Another group element to have our y-axis grouped under one group element
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yExplainedVarianceScale)) //We have also specified the number of ticks we would like our y-axis to have using ticks(10).
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "+3em")
        .attr("x", height - 700)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "16px")
        .text("Explained Variance");

    explainedVariances_to_points = [];

    for (let i = 0; i < explainedVariances.length - 1; i++) {
        explainedVariances_to_points.push({
            x1: PC_list[i],
            y1: explainedVariances[i],
            x2: PC_list[i + 1],
            y2: explainedVariances[i + 1]
        });
    }



    g.selectAll(".bar") //created dynamic bars with our data using the SVG rectangle element.
        .data(eigenvalues)
        .enter().append("rect")
        .attr("class", function (d, i) {
            if (i < bars_to_highlight) {
                return "highlighted_bar";
            } else {
                return "bar";
            }
        })
        .attr("x", function (d) { return xEigenvalueScale(PC_list[eigenvalues.indexOf(d)]); })  //x scale created earlier and pass the year value from our data.
        .attr("y", function (d) { return yEigenvalueScale(d); }) // pass the data value to our y scale and receive the corresponding y value from the y range.
        .attr("width", xEigenvalueScale.bandwidth()) //width of our bars would be determined by the scaleBand() function.
        .attr("height", function (d) { return height - yEigenvalueScale(d); }); //height of the bar would be calculated as height - yScale(d.value)


    g.selectAll(".line")
        .data(explainedVariances_to_points)
        .enter()
        .append("line")
        .attr("class", "line")
        .attr("x1", function (d) { return xExplainedVarianceScale(d.x1); })
        .attr("y1", function (d) { return yExplainedVarianceScale(d.y1); })
        .attr("x2", function (d) { return xExplainedVarianceScale(d.x2); })
        .attr("y2", function (d) { return yExplainedVarianceScale(d.y2); })
        .attr("transform", "translate(" + xExplainedVarianceScale.bandwidth() / 2 + ",0)")

    g.selectAll(".dot")
        .data(explainedVariances)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d, i) { return xExplainedVarianceScale(PC_list[i]) + xExplainedVarianceScale.bandwidth() / 2; })
        .attr("cy", function (d) { return yExplainedVarianceScale(d); })
        .attr("r", 5)
        .attr("fill", "red")

    g.selectAll(".line")
    .append("line")
    .attr("class", "line")
    .attr("x1", function (d) { return xExplainedVarianceScale(0); })
    .attr("y1", function (d) { return yExplainedVarianceScale(threshold); })
    .attr("x2", function (d) { return width; })
    .attr("y2", function (d) { return yExplainedVarianceScale(threshold); })
}

function scatter_plot(g, data, PC_pairs, numerical_headers) {


    let X_minValue = d3.min(data, function (d) { return Number(d[0]); });
    let X_maxXValue = d3.max(data, function (d) { return Number(d[0]); });
    let Y_minValue = d3.min(data, function (d) { return Number(d[1]); });
    let Y_maxValue = d3.max(data, function (d) { return Number(d[1]); });


    let xScale = d3.scaleLinear().range([0, width]);
    let yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain([X_minValue - 0.1, X_maxXValue + 0.1]);
    yScale.domain([Y_minValue - 0.1, Y_maxValue + 0.1]);


    svg.append('text')
        .attr('x', width / 1.6)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .style("font-size", "28px")
        .attr("font-weight", "bolder")
        .attr("fill", "royalblue")
        .style("text-decoration", "none")
        .text("PCA-based biplot")

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
        .text('PC1');

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
        .text('PC2');


    g.selectAll(".circle") //created dynamic bars with our data using the SVG rectangle element.
        .data(data)
        .enter().append("circle")
        .attr("r", 1.2)
        .attr("cx", function (d) { return xScale(d[0]); })
        .attr("cy", function (d) { return yScale(d[1]); })
        .style("fill", "steelblue")

    g.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 20)
        .attr("markerHeight", 30)
        .attr("markerUnits", "userSpaceOnUse")
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "black");




    g.selectAll('.line')
        .data(PC_pairs)
        .enter()
        .append('line')
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", function (d) { return xScale(0) })
        .attr("y1", function (d) { return yScale(0) })
        .attr("x2", function (d) { return xScale(d[0] * (X_maxXValue - X_minValue) / 2) })
        .attr("y2", function (d) { return yScale(d[1] * (Y_maxValue - Y_minValue) / 2) })
        .attr('marker-end', 'url(#arrow)');


    g.append("g").selectAll("text")
        .data(PC_pairs)
        .enter()
        .append("text")
        .attr("x", function (d) { return xScale((d[0]+0.01) * (X_maxXValue - X_minValue) / 2) })
        .attr("y", function (d) { return yScale((d[1]+0.01) * (Y_maxValue - Y_minValue) / 2) })
        .attr("fill", "red")
        .attr("font-size", "12px")
        .attr("font-weight", "bolder")
        .text(function (d, i) { return numerical_headers[i] });

}
