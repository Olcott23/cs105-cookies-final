class StackedAreaChart {

    constructor(element, data) {
        this.element = element;
        this.data = data.stackedData; // processed data
        this.categories = data.categories;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Existing code for margins and dimensions...
        vis.margin = { top: 110, right: 20, bottom: 80, left: 80 };
        const parentWidth = d3.select("#" + vis.element).node().getBoundingClientRect().width;
        vis.width = parentWidth - vis.margin.left - vis.margin.right;
        vis.height = 430 - vis.margin.top - vis.margin.bottom;

        // Append SVG to the DOM with responsive settings
        vis.svg = d3.select("#" + vis.element).append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr("viewBox", `0 0 ${parentWidth} ${vis.height + vis.margin.top + vis.margin.bottom}`)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        const customColors = ['#b8a1c0', '#16207A', '#AFAFD0'];

        // Color scale
        vis.color = d3.scaleOrdinal()
            .domain(vis.categories)
            .range(customColors);

        // Create scales
        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.1)
            .domain(vis.data.map(d => d.period));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        // Initialize stack layout
        vis.stack = d3.stack()
            .keys(vis.categories);

        vis.xAxis = d3.axisBottom(vis.x)
            .tickFormat((d, i) => i % 2 === 0 ? d : '');

        // Initialize area generator
        vis.area = d3.area()
            .x(d => vis.x(d.data.period))
            .y0(d => vis.y(d[0]))
            .y1(d => vis.y(d[1]));

        vis.tooltip = vis.svg.append("text")
            .attr("x", vis.width - 10)
            .attr("y", 40)
            .style("border", "solid")
            .style("font-weight", "bold")
            .style("text-anchor", "end")
            .style("opacity", 0)
            .style("font-family", "'Roboto', sans-serif")
            .style("font-size", "30px");

        // Draw the chart
        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        // Stack the data
        const stackedValues = vis.stack(vis.data);

        // Set y-axis domain
        vis.y.domain([0, d3.max(stackedValues, d => d3.max(d, d => d[1]))]);

        // Draw areas
        vis.svg.selectAll(".category")
            .data(stackedValues)
            .enter().append("g")
            .attr("class", "category")
            .attr("fill", d => vis.color(d.key))
            .selectAll("path")
            .data(d => [d])
            .enter().append("path")
            .attr("d", vis.area);

        // Draw axes
        vis.svg.append("g")
            .attr("transform", `translate(0,${vis.height})`)
            .call(vis.xAxis);

        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        vis.svg.selectAll(".category")
            .on("mouseover", (event, d) => {
                vis.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
                vis.tooltip
                    .text(d.key + " Cookies")
                    .attr("fill", vis.color(d.key));
            })
            .on("mouseout", () => {
                vis.tooltip
                    .transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        //  X-axis label
        vis.svg.append("text")
            .attr("transform", `translate(${vis.width / 2}, ${vis.height + vis.margin.bottom - 30})`)
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-size", "10px") // Set font size to smaller
            .style("font-family", "'Roboto', sans-serif") // Set font family to Roboto
            .text("Time in Months");

        //  Y-axis label
        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left + 30)
            .attr("x", 0 - (vis.height / 2 + 10))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "#727E7C")
            .style("font-size", "10px") // Set font size to smaller
            .style("font-family", "'Roboto', sans-serif") // Set font family to Roboto
            .text("Number of Cookies Stored");
    }

}
