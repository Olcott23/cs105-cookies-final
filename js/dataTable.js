class DataTable {
    constructor(data) {
        this.data = data;
        this.element = "#data-table";
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Set margins and dimensions, similar to the area chart
        vis.margin = { top: 20, right: 50, bottom: 20, left: 20 };
        vis.width = 1000 - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

        // Append SVG to the DOM
        vis.svg = d3.select(vis.element).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Create a container for the table with a fixed height and scrollable overflow
        const tableContainer = vis.svg.append('foreignObject')
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append("xhtml:body")
            .append("div")
            .style("height", vis.height + "px")
            .style("overflow", "scroll")
            .style("font", "10px 'Roboto', sans-serif");

        // Create the table within the container
        vis.createTable(tableContainer);
    }

    createTable(container) {
        const vis = this;

        const table = container.append("table")
            .style("border-collapse", "collapse")
            .style("border", "1px solid white") // Set border to white
            .style("width", "100%") // Set table width to 100% of the container
            .style("background-color", "lavender"); // Set background color to lavender

        // Create the table header
        const thead = table.append('thead');
        thead.append('tr')
            .selectAll('th')
            .data(Object.keys(vis.data[0]))
            .enter()
            .append('th')
            .text(d => d)
            .style("border", "1px solid white") // Set border to white
            .style("padding", "5px")
            .style("background-color", "#E6E6FA") // Lighter lavender for header
            .style("font-weight", "bold")
            .style("color", "black"); // Text color for header

        // Create the table body
        const tbody = table.append('tbody');
        vis.data.forEach(d => {
            const row = tbody.append('tr');
            Object.values(d).forEach(value => {
                row.append('td')
                    .text(value)
                    .style("border", "1px solid white") // Set border to white
                    .style("padding", "5px")
                    .style("color", "black"); // Text color for body
            });
        });
    }
}
