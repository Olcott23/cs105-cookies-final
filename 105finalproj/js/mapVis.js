class MapVis {
    constructor(element, data) {
        this.element = element;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Get the width of the parent container
        const parentWidth = d3.select("#" + vis.element).node().getBoundingClientRect().width;

        // Define margins
        vis.margin = { top: 50, right: 30, bottom: 30, left: 30 };
        vis.width = parentWidth - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom; // Maintain aspect ratio

        // Append SVG to the DOM with responsive settings
        vis.svg = d3.select("#" + vis.element)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${parentWidth} ${vis.height + vis.margin.top + vis.margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // Define Projection and Path Generator
        vis.projection = d3.geoAlbersUsa()
            .translate([vis.width / 2, vis.height / 2])
            .scale([800]); // Adjust as needed
        vis.pathGenerator = d3.geoPath().projection(vis.projection);

        // Create a tooltip div
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("border", "solid")
            .style("padding", "8px")
            .style("background", "white")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("font-family", "'Roboto', sans-serif");

        // Load and render US map using D3 and GeoJSON
        // Load and render US map using D3 and GeoJSON
        d3.json("data/state.json").then(geojsonData => {
            // Define color scale
            let colorScale = d3.scaleSequential(d3.interpolatePurples)
                .domain(d3.extent(Object.values(vis.data)));

            // Render each state
            vis.svg.selectAll(".state")
                .data(geojsonData.features)
                .enter().append("path")
                .attr("class", "state")
                .attr("d", vis.pathGenerator)
                .style("fill", d => colorScale(vis.data[d.properties.NAME] || 0))
                .style("stroke", "#AFAFD0")
                .style("stroke-width", 1)
                .on("mouseover", function (event, d) {
                    vis.tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    let stateName = d.properties.NAME;
                    let importance = vis.data[stateName] ? vis.data[stateName].toFixed(2) : "NA";
                    vis.tooltip.html(`<strong>State: </strong>${stateName}<br><strong>Average Ranking of Privacy Importance: </strong>${importance}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 15) + "px");
                })
                .on("mouseout", function () {
                    vis.tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            vis.addLegend();
        });
    }

    addLegend() {
        const vis = this;

        // Define legend dimensions and position
        let legendWidth = 20;
        let legendHeight = 200;
        let legendPosition = { x: vis.width - 300, y: vis.height / 2 - 100 }; // Adjusted position

        // Create a linear gradient for the legend
        let linearGradient = vis.svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient-privacy-importance")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");

        linearGradient.selectAll("stop")
            .data(d3.range(0, 1, 0.1))
            .enter().append("stop")
            .attr("offset", d => `${d * 100}%`)
            .attr("stop-color", d => d3.interpolatePurples(d));

        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", 0 - vis.margin.top / 2 + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-family", "'Roboto', sans-serif")
            .text("Importance of Privacy Per State, Ranked 0-100");

        // Append the gradient rectangle for the legend
        vis.svg.append("rect")
            .attr("x", legendPosition.x)
            .attr("y", legendPosition.y)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#gradient-privacy-importance)");

        // Append legend labels
        let scale = d3.scaleLinear().domain([0, 100]).range([legendHeight, 0]);
        let axis = d3.axisRight(scale).ticks(5);

        vis.svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${legendPosition.x + legendWidth}, ${legendPosition.y})`)
            .call(axis)
            .selectAll("text")
            .style("font-family", "'Roboto', sans-serif")
            .style("font-size", "10px");
    }
}
