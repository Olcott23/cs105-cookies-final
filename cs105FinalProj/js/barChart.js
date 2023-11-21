class BarChart {
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
            .text("Amount of Personal Information on Internet");

        // Add X-axis label
        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + vis.margin.bottom - 5)
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-size", "12px")
            .style("font-family", "'Roboto', sans-serif")
            .text("Amount of Information on Internet, Ranked 0-10");

        // Add Y-axis label
        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x", 0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-size", "12px")
            .style("font-family", "'Roboto', sans-serif")
            .text("Number of Responses");

        vis.data.sort((a, b) => d3.ascending(parseInt(a["Info.On.Internet"]), parseInt(b["Info.On.Internet"])));

        vis.x = d3.scaleBand()
            .domain(vis.data.map(d => d["Info.On.Internet"].toString()))
            .range([0, vis.width])
            .padding(0.1);

        // Count the number of responses for each "Info.On.Internet" value
        vis.counts = d3.rollup(
            vis.data,
            v => v.length, // Count the number of responses
            d => d["Info.On.Internet"].toString()
        );

        vis.y = d3.scaleLinear()
            .domain([0, d3.max(Array.from(vis.counts.values()))]) // Adjust the domain based on counts
            .nice()
            .range([vis.height, 0]);

        // Add x-axis
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .text(d => (d === "11" ? "NA" : d));

        // Add y-axis
        vis.svg.append("g")
            .call(d3.axisLeft(vis.y).ticks(5));

        // Create bars
        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => {
                const value = d["Info.On.Internet"].toString();
                if (value === "NA") {
                    // Position "NA" bars at the end, right after the 10th category
                    return vis.x("10") + vis.x.bandwidth();
                } else {
                    return vis.x(value);
                }
            })
            .attr("y", d => {
                const value = d["Info.On.Internet"].toString();
                if (value === "NA") {
                    // Position "NA" bars at the end of the x-axis
                    return vis.height;
                } else {
                    return vis.y(vis.counts.get(value) || 0);
                }
            })
            .attr("width", d => {
                const value = d["Info.On.Internet"].toString();
                if (value === "NA") {
                    // Set the width of "NA" bars to the same as other categories
                    return vis.x.bandwidth();
                } else {
                    return vis.x.bandwidth();
                }
            })
            .attr("height", d => {
                const value = d["Info.On.Internet"].toString();
                if (value === "NA") {
                    return 0; // Set the height of "NA" bars to 0
                } else {
                    return vis.height - vis.y(vis.counts.get(value) || 0);
                }
            })
            .style("fill", d => (d["Info.On.Internet"].toString() === "NA" ? "gray" : "#b8a1c0"));

        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Draw the chart
        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        // Add hover effect
        vis.bars
            .on("mouseover", function (event, d) {
                d3.select(this).style("fill", "#16207A");

                // Get the category value
                const value = d["Info.On.Internet"].toString();

                // Display the tooltip with the number of responses
                vis.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                vis.tooltip.html("<b>Number of Responses:</b> " + (vis.counts.get(value) || 0))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .style("background-color", "white")
                    .style("padding", "5px")
                    .style("border", "1px solid #ccc")
                    .style("border-radius", "5px")
                    .style("font-size", "14px")
                    .style("font-family", "'Roboto', sans-serif")
                    .style("text-align", "center")
            })
            .on("mouseout", function (event, d) {
                d3.select(this).style("fill", "#b8a1c0");

                // Hide the tooltip on mouseout
                vis.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // You can add more interactions or updates here if needed
    }
}
