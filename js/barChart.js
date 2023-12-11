class BarChart {
    constructor(element, data) {
        this.element = element;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Get the width of the parent container
        const parentWidth = d3.select("#" + this.element).node().getBoundingClientRect().width;

        // Set margins
        vis.margin = { top: 70, right: 60, bottom: 40, left: 50 };

        // Adjust width and height based on parent container's width
        vis.width = parentWidth - vis.margin.left - vis.margin.right;
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

        // Count the number of responses for each "Info.On.Internet" value
        vis.counts = d3.rollup(
            vis.data,
            v => v.length, // Count the number of responses
            d => d["Info.On.Internet"].toString()
        );

        // Define scales
        vis.x = d3.scaleBand()
            .domain(vis.data.map(d => d["Info.On.Internet"].toString()))
            .range([0, vis.width])
            .padding(0.1);

        vis.y = d3.scaleLinear()
            .domain([0, d3.max(Array.from(vis.counts.values()))]) // Adjust the domain based on counts
            .nice()
            .range([vis.height, 0]);

        // Add axes
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.x));

        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        // Create bars
        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.x(d["Info.On.Internet"].toString()))
            .attr("y", d => vis.y(vis.counts.get(d["Info.On.Internet"].toString()) || 0))
            .attr("width", vis.x.bandwidth())
            .attr("height", d => vis.height - vis.y(vis.counts.get(d["Info.On.Internet"].toString()) || 0))
            .style("fill", d => (d["Info.On.Internet"].toString() === "NA" ? "gray" : "#b8a1c0"));

        vis.addTooltip();
    }


    addTooltip() {
        const vis = this;

        // Create a tooltip div
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("font-family", "'Roboto', sans-serif");

        // Add hover effect for the bars
        vis.bars.on("mouseover", function (event, d) {
            d3.select(this).style("fill", "#16207A");
            vis.tooltip.transition().duration(200).style("opacity", .9);
            vis.tooltip.html("<b>Number of Responses:</b> " + (vis.counts.get(d["Info.On.Internet"].toString()) || 0))
                .style("left", (event.pageX + 7) + "px")
                .style("top", (event.pageY - 10) + "px");
        }).on("mouseout", function (d) {
            d3.select(this).style("fill", d => (d["Info.On.Internet"].toString() === "NA" ? "gray" : "#b8a1c0"));
            vis.tooltip.transition().duration(500).style("opacity", 0);
        });
    }

    updateVis() {
        const vis = this;

        // Update bar positions and dimensions
        vis.svg.selectAll(".bar")
            .data(vis.data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => vis.x(d["Info.On.Internet"].toString()))
            .attr("width", vis.x.bandwidth())
            .attr("y", d => vis.y(vis.counts.get(d["Info.On.Internet"].toString()) || 0))
            .attr("height", d => vis.height - vis.y(vis.counts.get(d["Info.On.Internet"].toString()) || 0))
            .style("fill", d => (d["Info.On.Internet"].toString() === "NA" ? "gray" : "#b8a1c0"))
            .on("mouseover", function (event, d) {
                d3.select(this).style("fill", "#16207A");
                vis.tooltip.transition().duration(200).style("opacity", .9);
                vis.tooltip.html("<b>Number of Responses:</b> " + (vis.counts.get(d["Info.On.Internet"].toString()) || 0))
                    .style("left", (event.pageX + 7) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", d => (d["Info.On.Internet"].toString() === "NA" ? "gray" : "#b8a1c0"));
                vis.tooltip.transition().duration(500).style("opacity", 0);
            });
    }

}
