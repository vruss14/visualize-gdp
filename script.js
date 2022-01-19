// Fetch and convert the data into JSON, then create the chart

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response => response.json())
.then(resp => {
    createChart(resp.data)
})

function createChart(dataset) {

    let w;
    let h;
    let padding = 60;

    // Set SVG canvas dimensions conditionally based on user's device

    if(window.innerWidth > 992) {
        w = 900;
        h = 600;
    } else if (window.innerWidth > 768) {
        w = 600;
        h = 400;
        
    } else {
        w = window.innerWidth;
        h = 350;
    }


    // How tall the bars in the chart should be
    // Domain = smallest data point a bar can be is 0, largest it can be is the largest GDP
    // Range = the bar can be 0, but the largest it should be is the max height (600) - padding on the top and bottom (so 2 * padding)

    const barHeightScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, h - (2 * padding)]);

    // xScale is based on the index of each data point; lowest is 0 and the highest is the last item in the array
    // Starts slightly to the left (based on padding) and then the max is all the way over to the right (minus padding so that it lines up with the axis)

    const xScale = d3.scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, w - padding]);

    // Convert all the first items in the dataset to JavaScript date objects

    let datesArray = dataset.map((item) => {
        return new Date(item[0])
    })

    // scaleTime is used to generate years on the x axis based on the dates; scaleLinear would not work because it would generate values like 1,950
    // Minimum value = the earliest date; maximum value = the most recent date
    // Range matches x scale; should line up perfectly with the dataset index values

    const xAxisScale = d3.scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, w - padding])

    // Y axis starts at zero and goes all the way up to the max GDP value in the data set
    // For positioning the y axis, lowest is h - padding while the highest value is just padding (the reverse would invert it)

    const yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding ])


    // Make the SVG
    const svg = d3.select("#light-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr('id', 'title');

    const toolTip = d3.select('#light-container').append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

    // Create a bar for each data point
    // x positioning is based on index; y positioning is based on scaling the height of the bar according to the GDP value but keeping it within the chart's padding
    // To space the bars evenly, the width of each bar should be width - (2 * padding) (so that way it's within the x axis) divided by the number of items in the dataset
    // Height of each bar corresponds to GDP value
    // Mouseover events make the tooltip visible; mouseout events hide the tooltip; tooltip indicates date & GDP value

    svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => (h - padding) - barHeightScale(d[1]))
    .attr("width", (w - (2 * padding)) / dataset.length)
    .attr("height", (d) => barHeightScale(d[1]))
    .attr("fill", "turquoise")
    .attr("class", "bar")
    .attr("data-date", (d) => `${d[0]}`)
    .attr("data-gdp", (d) => `${d[1]}`)
    .on('mouseover', function(event) {
        toolTip.style('opacity', 1)
        toolTip.html(`
        <p>Date: ${event.target.__data__[0]}</p>
        <p>GDP: $${event.target.__data__[1]}B</p>`)
        toolTip.attr('data-date', event.target.__data__[0])
    })
    .on('mouseout', function () {
        toolTip.style('opacity', 0)
    })

    // Create and append x axis and y axis
    const xAxis = d3.axisBottom(xAxisScale);
    const yAxis = d3.axisLeft(yAxisScale);

    svg.append("g")
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", "translate(0," + (h - padding) + ")")

    svg.append("g")
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr("transform", "translate(" + padding + ",0)")
}
