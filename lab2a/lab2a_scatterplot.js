function drawScatterPlotMatrix(data1, data2, data3, data4, attribute1, attribute2, color) {
    flag = 0;
    dict = { 0: data1, 1: data2, 2: data3, 3: data4 };
    let data_length = data1.length;

    for (let i = 0; i < 4; i++) {
        let y_axis_data = dict[i];

        for (let j = 0; j < 4; j++) {
            let x_axis_data = dict[j];

            let data = []
            for (c = 0; c < data_length; c++) {
                data.push([x_axis_data[c], y_axis_data[c]]);
            }
            let heightx = height / 4.1;
            let widthx = width / 4;
            let xScale = d3.scaleLinear().domain([d3.min(x_axis_data), d3.max(x_axis_data)]).range([0, widthx]);

            let g = svg.append("g").attr("transform", "translate(" + (10 + 100 + j * widthx + j * 25) + "," + (15 + 65 + i * heightx + i * 35) + ")")
                .attr("class", "formatmatrix");

            g.append("g")
                .attr("transform", "translate(0," + heightx + ")")
                .call(d3.axisBottom(xScale));

            g.append("g")
                .attr("transform", "translate(0," + heightx + ")")
                .call(d3.axisBottom(xScale))

            // Add Y axis
            let y = d3.scaleLinear().domain([d3.min(y_axis_data), d3.max(y_axis_data)]).range([heightx, 0]);
            g.append("g").call(d3.axisLeft(y))

            svg.append('text')
                .attr('x', width / 1.5)
                .attr('y', 45)
                .attr('text-anchor', 'middle')
                .style("color", "green")
                .style("font-size", "28px")
                .attr("font-weight", "bolder")
                .text("Scatterplot matrix")

            g.append('g')
                .attr("id", "col")
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(d[0]);
                })
                .attr("cy", function (d) {
                    return y(d[1]);
                })
                .attr("r", 1)
                .style("fill", "steelblue")
        }

    }

}


function scatter_plot_tab() {


    d3.csv("spotify_top_100.csv", function (err, data) {
        if (err) {
            throw err;
        }

        let numerical_header_indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        let numerical_headers = ['Tempo', 'Energy', 'Danceability', 'Intensity', 'Live Likelihood', 'Positiveness', 'Duration', 'Acoustic', 'Speech Focus']
        let headers = Object.keys(data[0]);

        // Extract the non numerical headers
        let non_numerical_headers = headers.filter(function (item) {
            return !numerical_headers.includes(item);
        });

        // Remove the non numerical columns from the data
        data.map(function (d) {
            for (let i = 0; i < non_numerical_headers.length; i++) {
                delete d[non_numerical_headers[i]];
            }
        });

        // Convert the data to array
        let data_array = data_to_array(data, numerical_headers);

        // Normalize the data
        data_array = z_score_normalize_data(data_array);

        let vectors = PCA.getEigenVectors(data_array);

        // Extract the eigen vectors from the vectors
        let eigenVectors = [];
        for (let i = 0; i < vectors.length; i++) {
            eigenVectors.push(vectors[i].vector);
        }

        // Calculate the squared eigen vectors
        let squaredEigenVectors = [];
        for (let i = 0; i < eigenVectors.length; i++) {
            let squaredEigenVector = [];
            for (let j = 0; j < eigenVectors[i].length; j++) {
                squaredEigenVector.push(eigenVectors[i][j] * eigenVectors[i][j]);
            }
            squaredEigenVectors.push(squaredEigenVector);
        }

        // Calculate the loading vector
        let loadingVector = []
        for (let i = 0; i < squaredEigenVectors[0].length; i++) {
            let sum = 0;
            for (let j = 0; j < squaredEigenVectors[i].length; j++) {
                sum += squaredEigenVectors[j][i];
            }
            loadingVector.push(Math.sqrt(sum));
        }

        // Sort the numerical headers according to the loading vector
        let sortedNumericalHeaderIndices = numerical_header_indices.sort(function (a, b) {
            return loadingVector[numerical_header_indices.indexOf(b)] - loadingVector[numerical_header_indices.indexOf(a)];
        });

        let sortedNumericalHeaders = numerical_headers.sort(function (a, b) {
            return loadingVector[numerical_headers.indexOf(b)] - loadingVector[numerical_headers.indexOf(a)];
        });
        // console.log(sortedNumericalHeaderIndices)

        let scatterPlotAttributes = [sortedNumericalHeaders[0], sortedNumericalHeaders[1], sortedNumericalHeaders[2], sortedNumericalHeaders[3]];

        // create a table
        d3.selectAll("body > table").remove();

        let table = d3.select("body").append("table").attr("id", "scatter_plot_table").attr("class", "table table-bordered  table-condensed");
        let thead = table.append("thead")

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(['Attribute 1', 'Attribute 2', 'Attribue 3', 'Attribute 4'])
            .enter()
            .append("th")
            .text(function (d, i) { { return d + " = " + scatterPlotAttributes[i]; } });

        let scatterPlotData1 = [];
        let scatterPlotData2 = [];
        let scatterPlotData3 = [];
        let scatterPlotData4 = [];

        for (let i = 0; i < data_array.length; i++) {
            scatterPlotData1.push(data_array[i][sortedNumericalHeaderIndices[0]]);
            scatterPlotData2.push(data_array[i][sortedNumericalHeaderIndices[1]]);
            scatterPlotData3.push(data_array[i][sortedNumericalHeaderIndices[2]]);
            scatterPlotData4.push(data_array[i][sortedNumericalHeaderIndices[3]]);
        }

        d3.selectAll("svg > *").remove();


        drawScatterPlotMatrix(scatterPlotData1, scatterPlotData2, scatterPlotData3, scatterPlotData4, 'PC1', 'PC2')

    });
}