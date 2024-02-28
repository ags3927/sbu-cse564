function screeplot_for_eigenvalues(data) {
    let vectors = PCA.getEigenVectors(data)

    let eigenvalues = [];
    // Extract eigenvalues from the vectors    
    for (let i = 0; i < vectors.length; i++) {
        eigenvalues.push(vectors[i].eigenvalue);
    }

    // Sort eigenvalues in descending order
    eigenvalues.sort(function (a, b) {
        return b - a;
    });

    d3.selectAll("svg > *").remove();

    var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");

    plot_categorical(g, eigenvalues)

}

function scree_plot_tab() {

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

        screeplot_for_eigenvalues(data_array);

    });
}
