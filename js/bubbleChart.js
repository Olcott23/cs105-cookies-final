class BubbleChart {
    constructor(element, data) {
        this.element = element;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Get the width of the parent container
        const parentWidth = d3.select("#" + vis.element).node().getBoundingClientRect().width;

        vis.margin = { top: 10, right: 10, bottom: 10, left: 10 };
        vis.width = parentWidth - vis.margin.left - vis.margin.right;
        vis.height = parentWidth * (400 / 1300) - vis.margin.top - vis.margin.bottom; // Maintain aspect ratio

        // Append SVG to the DOM with responsive settings
        vis.svg = d3.select("#" + vis.element).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${parentWidth} ${vis.height + vis.margin.top + vis.margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // Create a tooltip div
        vis.tooltip = d3.select("#" + vis.element).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("padding", "5px")
            .style("border-radius", "8px")
            .style("pointer-events", "none")
            .style("fill", "#727E7C")
            .style("font-family", "'Roboto', sans-serif")
            .style("font-size", "14px");

        let colorScale = d3.scaleSequential(d3.interpolatePurples)
            .domain([0, vis.data.length]);

        // Create bubbles with varying shades of purple
        vis.bubbles = vis.svg.selectAll(".bubble")
            .data(vis.data)
            .enter().append("circle")
            .attr("class", "bubble")
            .attr("cx", () => Math.random() * vis.width)
            .attr("cy", () => Math.random() * vis.height)
            .attr("r", 7) // Set the initial radius of bubbles
            .style("fill", (d, i) => colorScale(i)) // Use color scale based on index
            .style("stroke", "#AFAFD0") // Outline color
            .style("stroke-width", "2px") // Outline width
            .style("fill-opacity", 0.9); // Opacity

        // Add hover effect to show tooltip
        vis.bubbles
            .on("mouseover", function (event, d) {
                vis.tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);

                vis.tooltip.html(`<b>Platform:</b> ${d.Platform}<br><b>Description:</b> ${d.Description}`)
                    .style("left", (event.pageX - 30) + "px")
                    .style("top", (event.pageY - 90) + "px");
            })
            .on("mouseout", function (d) {
                vis.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }
}
