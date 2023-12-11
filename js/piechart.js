class PieChart {
    constructor(element, data) {
        this.element = element;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Define margins
        vis.margin = {top: 20, right: 5, bottom: 10, left: 10};

        // Get the width of the parent container
        const parentWidth = d3.select("#" + vis.element).node().getBoundingClientRect().width;

        // Adjusted width and height considering margins
        vis.width = parentWidth - vis.margin.left - vis.margin.right;
        vis.height = parentWidth - vis.margin.top - vis.margin.bottom; // Keep the aspect ratio square
        vis.radius = Math.min(vis.width, vis.height) / 2;

        // Append SVG to the DOM with responsive settings
        vis.svg = d3.select("#" + vis.element)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${parentWidth} ${parentWidth}`)
            .append("g")
            .attr("transform", `translate(${vis.width / 2 + vis.margin.left}, ${vis.height / 2 + vis.margin.top})`);
        // Custom color scale
        // Define an array of purple shades
        const purpleShades = ['#b3bee4', '#b8a1c0', '#5e4b98', '#04206d', '#5f78ba'];

        // Custom color scale with purple shades
        vis.color = d3.scaleOrdinal()
            .domain(vis.data.map(d => d.platform))
            .range(purpleShades);

        // Compute positions for each group on the pie
        vis.pie = d3.pie()
            .value(d => d.value);

        // Shape helper to build arcs
        vis.arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(vis.radius);

        vis.total = d3.sum(vis.data, d => d.value);

        // Create a tooltip div
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("border", "solid")
            .style("padding", "8px")
            .style("background", "white")
            .style("border-radius", "8px")
            .style("pointer-events", "none")
            .style("fill", "#727E7C")
            .style("font-family", "'Roboto', sans-serif")
            .style("font-size", "14px");

        // Draw the chart
        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        // Bind the data to the pie chart
        vis.svg
            .selectAll('path')
            .data(vis.pie(vis.data))
            .enter()
            .append('path')
            .attr('d', vis.arcGenerator)
            .attr('fill', d => vis.color(d.data.platform)) // Use custom color scale
            .attr("stroke", "none"); // Remove stroke

        // Mouseover event
        vis.svg.selectAll('path')
            .on("mouseover", (event, d) => {
                vis.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                // Include platform and percentage in the tooltip
                const percentage = (d.data.value / vis.total * 100).toFixed(2) + '%';
                vis.tooltip.html(`<strong>${d.data.platform}</strong>: ${percentage}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                vis.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    }
}
