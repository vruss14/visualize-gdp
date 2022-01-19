fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response => response.json())
.then(resp => {
    createChart(resp.data)
})

function createChart(dataset) {
    console.log(dataset);

    const w = 900;
    const h = 700;
    const padding = 60;

    // Min in x direction is year 1947; parseInt returns correct value
    // Max in x direction is year 2015; parseInt returns 2015 from the date
    const xScale = d3.scaleLinear()
    .domain([d3.min(dataset, (d) => parseInt(d[0])), d3.max(dataset, (d) => parseInt(d[0]))])
    .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

    // Make the SVG with width 900 & height 700
    const svg = d3.select("#light-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr('id', 'title');

    const toolTip = d3.select('#light-container').append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

    // Create a bar for each data point
    // x position = index * 3 + padding
    // y position = 0.03 scale to fit all data points on screen

    svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i * 2.84) + padding)
    .attr("y", (d, i) => h - (0.03 * d[1]) - padding)
    .attr("width", 2)
    .attr("height", (d, i) => d[1] * 0.03)
    .attr("fill", "lightblue")
    .attr("class", "bar")
    .attr("data-date", (d) => `${d[0]}`)
    .attr("data-gdp", (d) => `${d[1]}`)
    .on('mouseover', function(event) {
        toolTip.style('opacity', 1)
        toolTip.html(event.target.__data__[1])
        toolTip.style('left', 300)
        toolTip.style('top', 300)
        toolTip.attr('data-date', event.target.__data__[0])
    })
    .on('mouseout', function () {
        toolTip.style('opacity', 0)
    })

    // Create and append X and Y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr('id', 'x-axis')
    .call(xAxis);

    svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr('id', 'y-axis')
    .call(yAxis)
}

