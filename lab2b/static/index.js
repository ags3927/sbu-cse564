function data_mds_plot(type = 'data') {
    document.getElementById("svgContainer").innerHTML = '<svg id="mysvg" width="1200" height="700"></svg>';
    let svg = d3.select("#mysvg");
    data_mds_scatter_plot(svg, data_mds, k_means_labels);
}

function parallel_coords() {
    document.getElementById("svgContainer").innerHTML = '<svg id="mysvg" width="1200" height="700"></svg>';
    let svg = d3.select("#mysvg");
    parallel_coordinates_plot(svg, k_means_labels, flag=0);
}

function var_mds_plot() {
    
    document.getElementById("svgContainer").innerHTML = '<svg id="mysvg1" width="700" height="600"></svg> \
    <svg id="mysvg2" width="800" height="600" style="margin-left: 80px"></svg>';

    let svg1 = d3.select("#mysvg1");
    let svg2 = d3.select("#mysvg2");
    var_mds_scatter_plot_with_pc(svg1, svg2, var_mds, k_means_labels);
}


