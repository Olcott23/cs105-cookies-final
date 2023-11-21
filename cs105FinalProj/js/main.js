
let areachart;


loadData();

// 1. Preprocess the Data
// Assuming the data is loaded as an array of objects
function convertRetentionToMonths(period) {
    const sessionIndefinite = -1; // Use -1 or another value to represent 'session' or 'end of session'
    if (period.toLowerCase().includes("session")) {
        return sessionIndefinite;
    }

    let months = 0;
    let matches = period.match(/(\d+)\s*(year|month|day)/i);

    if (matches) {
        let value = parseInt(matches[1]);
        switch (matches[2].toLowerCase()) {
            case 'year':
                months = value * 12;
                break;
            case 'month':
                months = value;
                break;
            case 'day':
                months = Math.ceil(value / 30); // Approximate 1 month as 30 days
                break;
        }
    }
    return months;
}

function processData(data) {
    const categories = Array.from(new Set(data.map(d => d.Category)));
    let uniquePeriods = Array.from(new Set(data.map(d => convertRetentionToMonths(d["Retention period"]))));

    // Sort periods and handle the session case
    uniquePeriods = uniquePeriods.filter(d => d >= 0).sort((a, b) => a - b);
    if (uniquePeriods.includes(-1)) {
        uniquePeriods.push(-1); // Add the session period at the end if it exists
    }

    // Initialize counts
    let counts = {};
    categories.forEach(category => {
        counts[category] = {};
        uniquePeriods.forEach(period => {
            counts[category][period] = 0;
        });
    });

    // Count the number of cookies per category and retention period
    data.forEach(d => {
        let periodMonths = convertRetentionToMonths(d["Retention period"]);
        counts[d.Category][periodMonths] += 1;
    });

    let stackedData = uniquePeriods.map(period => {
        let row = { period: period === -1 ? 'Session' : period + 'mo' };
        categories.forEach(category => {
            row[category] = counts[category][period];
        });
        return row;
    });

    return { categories, stackedData };
}

function processDataForPieChart(data) {
    // Aggregate data by platform
    let platformCounts = data.reduce((acc, val) => {
        acc[val.Platform] = (acc[val.Platform] || 0) + 1;
        return acc;
    }, {});

    // Convert the aggregated data into an array suitable for the pie chart
    let pieChartData = Object.entries(platformCounts).map(([platform, count]) => {
        return { platform: platform, value: count };
    });

    return pieChartData;
}

function processDataForScatterPlot1(data) {
    // Filter out records with missing Age or Privacy Importance values
    return data.filter(d => d.Age !== "NA" && d["Privacy.Importance"] !== "NA");
}

function processDataForBarChart(data) {
    // Filter out records with missing Age or Privacy Importance values
    return data.filter(d => d.Age !== "NA" && d["Info.On.Internet"] !== "NA");
}


function loadData() {

    d3.csv("data/cookie_database.csv").then(csvData => {

        console.log("data", csvData);

        let data = processData(csvData);

        let stickFigure = new StickFigure();

        console.log('data loaded');

        areachart = new StackedAreaChart('stacked-area-chart', data);

        let bubbleChart = new BubbleChart('bubble-chart', csvData);

        // Additional code to prepare data for the pie chart
        let pieChartData = processDataForPieChart(csvData);
        let piechart = new PieChart('pie-chart', pieChartData);

        // Load scatter plot data
        d3.csv("data/AnonymityPoll.csv").then(scatterPlotData => {
            let processedScatterPlotData1 = processDataForScatterPlot1(scatterPlotData);
            let scatterplot1 = new ScatterPlot('scatter-plot-1', processedScatterPlotData1);
        });

        d3.csv("data/AnonymityPoll.csv").then(barChartData => {
            // Preprocess the data to count responses for each category of "Info.On.Internet"
            let processedBarChartData = processDataForBarChart(barChartData); // Implement processDataForBarChart if needed

            console.log("Processed Bar Chart Data:", processedBarChartData); // Add this line to check the data

            // Create a bar chart instance with the processed data
            let barChart = new BarChart('bar-chart', processedBarChartData);
        });
    });
}
