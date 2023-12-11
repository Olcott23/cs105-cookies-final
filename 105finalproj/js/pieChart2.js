class PieChart2 {
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
        vis.margin = { top: 20, right: 10, bottom: 10, left: 10 };

        // Adjusted width and height considering margins
        vis.width = parentWidth - vis.margin.left - vis.margin.right;
        vis.height = parentWidth - vis.margin.top - vis.margin.bottom; // Maintain aspect ratio
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
        // Define an array of colors
        const colors = ['#4f2460', '#7d629d', '#5a5f9e'];

        // Custom color scale with the defined colors
        vis.color = d3.scaleOrdinal()
            .domain(vis.data.map(d => d.category))
            .range(colors);

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
            .style("padding", "8px")
            .style("background", "white")
            .style("border-radius", "8px")
            .style("pointer-events", "none")
            .style("fill", "#727E7C")
            .style("font-family", "'Roboto', sans-serif")
            .style("font-size", "14px")
            .style("border", "solid");

        // Shape helper for labels
        vis.labelArc = d3.arc()
            .outerRadius(vis.radius - 80)
            .innerRadius(vis.radius - 80);

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
            .attr('fill', d => vis.color(d.data.category)) // Use custom color scale
            .attr("stroke", "none"); // Remove stroke

        // Mouseover event
        vis.svg.selectAll('path')
            .on("mouseover", (event, d) => {
                vis.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                // Include category and percentage in the tooltip
                const percentage = (d.data.value / vis.total * 100).toFixed(2) + '%';
                vis.tooltip.html(`${percentage}`)
                    .style("left", (event.pageX +10) + "px")
                    .style("top", (event.pageY - 5) + "px");
            })
            .on("mouseout", () => {
                vis.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        vis.labelArc = d3.arc()
            .outerRadius(vis.radius / 2) // Half the radius of the pie chart
            .innerRadius(vis.radius / 2);

        // Adding labels
        const labels = vis.svg.selectAll('g.label')
            .data(vis.pie(vis.data))
            .enter()
            .append('g')
            .attr('class', 'label')
            .attr('transform', d => `translate(${vis.labelArc.centroid(d)})`);

// Append first line of text
        labels.append('text')
            .attr('dy', '-0.1em') // Adjust vertical position of the first line
            .style('text-anchor', 'middle')
            .style("font-size", "38px") // Adjust font size as needed
            .style("fill", "white") // Color for visibility
            .style("font-family", "'Roboto', sans-serif")
            .text(d => this.getFirstLine(d.data.category));

        // Append second line of text
        labels.append('text')
            .attr('dy', '1.2em') // Adjust vertical position of the second line
            .style('text-anchor', 'middle')
            .style("font-size", "38px") // Adjust font size as needed
            .style("fill", "white") // Color for visibility
            .style("font-family", "'Roboto', sans-serif")
            .text(d => this.getSecondLine(d.data.category));

    }

    getFirstLine(category) {
        switch(category) {
            case "0":
                return "Not worried about";
            case "1":
                return "Worried about";
            case "NA":
                return "NA";
            default:
                return "";
        }
    }

    getSecondLine(category) {
        switch(category) {
            case "0":
            case "1":
                return "their online data";
            case "NA":
                return "";
            default:
                return "";
        }
    }
}