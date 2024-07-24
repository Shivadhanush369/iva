document.addEventListener('DOMContentLoaded', async (event) => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage

    try {
        // Fetch scope options with authorization header
        const response = await fetch('scopes', {
            method: 'GET', // Specify the HTTP method
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json' // Adjust content type if necessary
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const scopeSelect = document.getElementById('scope');

        data.forEach(scope => {
            const option = document.createElement('option');
            option.value = scope.url;
            option.text = scope.name;
            scopeSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching scopes:', error);
    }
});

function toggleCustomInput() {
    const scopeSelect = document.getElementById('scope');
    fetchAndDisplayAlerts(scopeSelect.value);
    donutchart(scopeSelect.value);
    fetchAndUpdateChart(scopeSelect.value);
}

function extractCweIds(data) {
    console.log(data);
    let cweIds = [];
    console.log("Starting extraction process...");

    for (let i = 0; i < data.length; i++) {
       
        // Ensure data[i] exists and check for 'site' property
        if (data[i] && Array.isArray(data[i].report.site)) {
            console.log("Sites array found");

            data[i].report.site.forEach(site => {
                console.log("Processing site:", site);

                // Ensure 'alerts' property is an array
                if (site.alerts && Array.isArray(site.alerts)) {
                    console.log("Alerts array found in site");

                    site.alerts.forEach(alert => {
                        console.log("Processing alert:", alert);

                        // Check for 'cweid' and add to 'cweIds'
                        if (alert.cweid) {
                            console.log("CWE ID found:", alert.cweid);
                            if (!cweIds.includes(alert.cweid)) {
                                cweIds.push(alert.cweid);
                            }
                        } else {
                            console.log("CWE ID missing in alert:", alert);
                        }
                    });
                } else {
                    console.log("No alerts array found in site:", site);
                }
            });
        } else {
            console.log("No sites array found in data");
        }
    }
    console.log(JSON.stringify(cweIds));
    console.log("Extracted CWE IDs:", cweIds);
    return cweIds;
}


function initializeCharts(data) {
    const cweIds = extractCweIds(data);

    // Count occurrences of each CWE ID
    const cweCount = cweIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    // Prepare data for Highcharts
    const chartData = Object.entries(cweCount).map(([id, count]) => ({
        name: id,
        y: count
    }));

    Highcharts.chart('container1', {
        chart: {
            type: 'pie'  // Still use 'pie' for donut chart
        },
        title: {
            text: 'CWE ID',
            align: 'center'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%'],
                innerSize: '50%',  // This creates the donut effect
                dataLabels: {
                    format: 'CWE ID: {point.name}',  // Custom format for data labels
                    color: '#ffffff'
                }
            }
        },
        tooltip: {
            formatter: function() {
                return `CWE ID: ${this.point.name}`;  // Custom format for tooltips
            }
        },
        series: [{
            name: 'CWE ID',
            data: chartData,
            size: '45%'
        }]
    });
}

Highcharts.chart('container3', {
    chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '80%'
    },
    title: {
        text: 'Risk Levels Distribution'
    },
    credits: {
        enabled: false
    },
    pane: {
        startAngle: -90,
        endAngle: 90,
        background: null,
        center: ['50%', '75%'],
        size: '110%'
    },
    yAxis: {
        min: 0,
        max: 100,
        tickPixelInterval: 72,
        tickPosition: 'inside',
        tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
        tickLength: 20,
        tickWidth: 2,
        minorTickInterval: null,
        labels: {
            distance: 20,
            style: {
                fontSize: '14px'
            }
        },
        lineWidth: 0,
        plotBands: [{
            from: 0,
            to: 40,
            color: '#55BF3B', // green
            thickness: 20,
            borderRadius: '50%',
            label: {
                text: 'Low Risk',
                style: {
                    color: '#FFFFFF'
                }
            }
        }, {
            from: 40,
            to: 70,
            color: '#DDDF0D', // yellow
            thickness: 20,
            label: {
                text: 'Medium Risk',
                style: {
                    color: '#000000'
                }
            }
        }, {
            from: 70,
            to: 100,
            color: '#DF5353', // red
            thickness: 20,
            label: {
                text: 'High Risk',
                style: {
                    color: '#FFFFFF'
                }
            }
        }]
    },
    series: [{
        name: 'Risk Level',
        data: [34], // Adjust this value based on your actual calculation
        tooltip: {
            valueSuffix: ' alerts'
        },
        dataLabels: {
            format: '{y} alerts',
            borderWidth: 0,
            color: (
                Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
            ) || '#333333',
            style: {
                fontSize: '16px'
            }
        },
        dial: {
            radius: '80%',
            backgroundColor: 'gray',
            baseWidth: 12,
            baseLength: '0%',
            rearLength: '0%'
        },
        pivot: {
            backgroundColor: 'gray',
            radius: 6
        }
    }]
});

// Add some life
setInterval(() => {
    const chart = Highcharts.charts[1];
    if (chart && !chart.renderer.forExport) {
        const point = chart.series[0].points[0],
            inc = Math.round((Math.random() - 0.5) * 20);

        let newVal = point.y + inc;
        if (newVal < 0 || newVal > 100) {
            newVal = point.y - inc;
        }
        console.log('Updating gauge chart to new value:', newVal); 
        point.update(newVal, true);
    }
}, 3000);

// Gauge options configuration
const gaugeOptions = {
    chart: {
        type: 'solidgauge',
        width: 380, // Set the width of the chart
        height: 250,
        marginTop: 100
    },
    title: null,
    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#fafafa',
            borderRadius: 5,
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    exporting: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    title: {
        text: 'Number of Scans'
    },
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },
    plotOptions: {
        solidgauge: {
            borderRadius: 3,
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

// Create or update the speed gauge chart
function updateGaugeChart(urlCount) {
    console.log('Updating Gauge Chart with URL Count:', urlCount);
    
    // Find the existing chart if it exists
    const existingChart = Highcharts.charts.find(chart => chart && chart.renderTo.id === 'container2');

    if (existingChart) {
        // Update the existing chart's data
        let point = existingChart.series[0].points[0];
        if (point) {
            point.update(urlCount);
        }
    } else {
        // Create a new chart if none exists
        Highcharts.chart('container2', Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 200,
                title: {
                    text: ''
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Speed',
                data: [urlCount],
                dataLabels: {
                    format:
                    '<div style="text-align:center">' +
                    '<span style="font-size:25px">{y}</span><br/>' +
                    '<span style="font-size:12px;opacity:0.4">scans</span>' +
                    '</div>'
                },
                tooltip: {
                    valueSuffix: ' scans'
                }
            }]
        }));
    }
}



async function donutchart(Url) {
    
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url: Url })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        
        if (data) {
            initializeCharts(data);
        }
    } catch (error) {
        console.error('Error fetching issues:', error);
    }
}


async function fetchAndUpdateChart(url) {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/scanned', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        console.log('Response Data:', data); // Log the full response

        if (data && data.urlCount !== undefined) {
            console.log('URL Count from Response:', data.urlCount); // Log urlCount specifically
            updateGaugeChart(data.urlCount);
        } else {
            console.error('urlCount is undefined or data is invalid:', data);
        }
    } catch (error) {
        console.error('Error fetching issues:', error);
    }
}
