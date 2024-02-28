function biplot(data, numerical_headers) {
    let vectors = PCA.getEigenVectors(data)

    // Adjust data along the first two principal components
    let adData = PCA.computeAdjustedData(data, vectors[0], vectors[1]);

    let PC1_eigenvector = vectors[0].vector;
    let PC2_eigenvector = vectors[1].vector;

    let PC_pairs = [];
    for (let i = 0; i < PC1_eigenvector.length; i++) {
        PC_pairs.push([PC1_eigenvector[i], PC2_eigenvector[i]]);
    }

    // Extract formatted adjusted data
    let formattedAdjustedData = adData.formattedAdjustedData

    // Reshape adjusted data to (1000, 2) shape
    let reshapedAdjustedData = []
    for (let i = 0; i < formattedAdjustedData[0].length; i++) {
        let row = []
        for (let j = 0; j < formattedAdjustedData.length; j++) {
            row.push(formattedAdjustedData[j][i])
        }
        reshapedAdjustedData.push(row)
    }

    d3.selectAll("svg > *").remove();

    var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

    scatter_plot(g, reshapedAdjustedData, PC_pairs, numerical_headers)
}

function biplot_tab() {
    d3.csv("spotify_top_100.csv", function (err, data) {
        if (err) {
            throw err;
        }

        numerical_headers = ['Tempo', 'Energy', 'Danceability', 'Intensity', 'Live Likelihood', 'Positiveness', 'Duration', 'Acoustic', 'Speech Focus']
        headers = Object.keys(data[0]);

        // Extract the non numerical headers
        non_numerical_headers = headers.filter(function (item) {
            return !numerical_headers.includes(item);
        });

        // Remove the non numerical columns from the data
        data.map(function (d) {
            for (let i = 0; i < non_numerical_headers.length; i++) {
                delete d[non_numerical_headers[i]];
            }
        });

        // Convert the data to array
        data_array = data_to_array(data, numerical_headers);

        // Normalize the data
        data_array = z_score_normalize_data(data_array);

        biplot(data_array, numerical_headers);

    });
}