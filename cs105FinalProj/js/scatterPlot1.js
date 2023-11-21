class ScatterPlot {
    constructor(element, data) {
        this.element = element;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.margin = { top: 70, right: 60, bottom: 40, left: 50 };
        vis.width = 480 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // Append SVG to the DOM
        vis.svg = d3.select("#" + vis.element).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // Add title
        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", 0 - vis.margin.top / 2 + 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-family", "'Roboto', sans-serif")
            .text("Importance of Privacy by Age");

        // Add X-axis label
        vis.svg.append("text")
            .attr("transform", `translate(${vis.width / 2}, ${vis.height + vis.margin.bottom - 5})`)
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-size", "12px") // Set font size to smaller
            .style("font-family", "'Roboto', sans-serif")
            .text("Age of Individual");

        // Add Y-axis label
        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x", 0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-size", "12px") // Set font size to smaller
            .style("font-family", "'Roboto', sans-serif")
            .text("Importance of Privacy, Ranked 0-100");

        // Define scales
        vis.x = d3.scaleLinear()
            .domain([15, 90])
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .domain([0, 100])  // Assuming Privacy.Importance is a percentage
            .range([vis.height, 0]);

        vis.color = d3.scaleOrdinal(d3.schemeCategory10);

        // Add axes
        vis.svg.append("g")
            .attr("transform", `translate(0,${vis.height})`)
            .call(d3.axisBottom(vis.x));

        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        // Create a tooltip div
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("padding", "5px")
            .style("border", "0px")
            .style("border-radius", "8px")
            .style("pointer-events", "none")
            .style("fill", "#727E7C")
            .style("font-family", "'Roboto', sans-serif")
            .style("font-size", "14px");

        // Draw the scatter plot
        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        // Adjust the size and opacity of the dots
        const dotRadius = 4;  // Smaller radius for the dots
        const dotOpacity = 0.9;  // More opaque

        vis.svg.selectAll("dot")
            .data(vis.data)
            .enter().append("circle")
            .attr("cx", d => vis.x(d.Age))
            .attr("cy", d => vis.y(d["Privacy.Importance"]))
            .attr("r", dotRadius)  // Use the smaller radius
            .style("fill", d => d.Sex === "Male" ? "#b2aade" : "#04206d")
            .style("opacity", dotOpacity);  // Set the opacity

        // Mouseover event
        vis.svg.selectAll("circle")
            .on("mouseover", (event, d) => {
                vis.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                vis.tooltip.html(
                    `<strong>Age:</strong> ${d.Age}<br>
                    <strong>Sex:</strong> ${d.Sex}<br>
                     <strong>Importance of Privacy:</strong> ${d["Privacy.Importance"]}<br>
                    <strong>State:</strong> ${d.State}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                vis.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }
}
