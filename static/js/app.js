d3.json("samples.json").then(data => {
    console.log(data)
    //Populate the dropdown
    d3.select("#selDataset")
        .selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
    onOptionChange(d3.select("#selDataset").property("value"));

})

/**
 * This function generates a bar chart
 * @param {[number]} x - x-axis values
 * @param {[string]} y - y-axis values
 * @param {[string]} text - labels to show when hovering over a bar
 */
function generateBarChart(x, y, text) {
    const data = [{
        type: 'bar',
        x,
        y,
        text,
        orientation: 'h'
    }];

    const layout = {
        title: 'Top 10 OTU',
        yaxis: { title: "OTU Labels" },
        xaxis: { title: "Values" },
        height: 600
    }

    Plotly.newPlot('bar', data, layout);
}

/**
 * This function generates a bubble chart
 * @param {*} x - x-axis labels
 * @param {*} y - y-axis labels
 * @param {*} text - labels to show when hovering over label
 */
function generateBubbleChart(x, y, text) {
    const data = [{
        x,
        y,
        text,
        mode: 'markers',
        marker: {
            color: x,
            size: y,
            colorscale: "Earth"
        }
    }];
    const layout = {
        xaxis: {
            title: {
                text: 'OTU ID',
            }
        }
    };
    Plotly.newPlot('bubble', data, layout);
}

/**
 * This function generates a gauage for number of belly button washes
 * @param {number} num - number of belly button washes required
 */
function generateGauge(num) {
    // Calc the meter point
    const offset = [0, 0, 3, 3, 1, -0.5, -2, -3, 0, 0];
    const degrees = 180 - (num * 20 + offset[num]);
    const height = 0.6;
    const widthby2 = 0.05;
    const radians = degrees * Math.PI / 180;
    const radiansBaseL = (90 + degrees) * Math.PI / 180;
    const radiansBaseR = (degrees - 90) * Math.PI / 180;
    const xHead = height * Math.cos(radians);
    const yHead = height * Math.sin(radians);
    const xTail0 = widthby2 * Math.cos(radiansBaseL);
    const yTail0 = widthby2 * Math.sin(radiansBaseL);
    const xTail1 = widthby2 * Math.cos(radiansBaseR);
    const yTail1 = widthby2 * Math.sin(radiansBaseR);

    // Create the triangle for the meter
    const pointer = `M ${xTail0} ${yTail0} L ${xTail1} ${yTail1} L ${xHead} ${yHead} Z`;

    const data = [{
        type: 'scatter',
        x: [0],
        y: [0],
        marker: { size: 16, color: '#850000' },
        showlegend: false,
        name: 'frequency',
        text: num,
        hoverinfo: 'text+name'
    },
    {
        values: [180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['#84B589', '#89BB8F', '#8CBF88', '#B7CC92', '#D5E49D',
                '#E5E7B3', '#E9E6CA', '#F4F1E5', '#F8F3EC', '#FFFFFF',]
        },
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: 0.5,
        type: 'pie',
        showlegend: false
    }];

    const layout = {
        shapes: [{ type: 'path', path: pointer, fillcolor: '#850000', line: { color: '#850000' } }],
        title: '<b>Belly Button Wash Frequency</b><br>Scrubs per Week',
        xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
        yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] }
    };
    Plotly.newPlot('gauge', data, layout);
}

/**
 * This function generates a list of metadata 
 * @param {[any]} data - metadata to display
 */
function generateMetadata(data) {
    var div = d3.select("#sample-metadata");
    div.html("")
    var list = div.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        list.append("li").text(key + ": " + value);
    });
}

function onOptionChange(value) {
    d3.json("samples.json").then(function (data) {

        const sample = data.samples.find(data => data.id === value);
        if (sample) {
            generateBarChart(sample.sample_values.slice(0, 10).reverse(), sample.otu_ids.slice(0, 10).reverse().map(id => "OTU " + id), sample.otu_labels.slice(0, 10).reverse());
            generateBubbleChart(sample.otu_ids, sample.sample_values, sample.otu_labels);
        }

        const metadata = data.metadata.find(data => data.id == value);
        console.log(metadata)
        if (metadata) {
            generateMetadata(metadata);
            generateGauge(metadata.wfreq);
        }
    });
}