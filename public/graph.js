document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken');
    console.log('Token retrieved:', token);

    try {
        const response = await fetch('/scopes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched scopes data:', data);

        const urlSelect = document.getElementById('scope');
        data.forEach(scope => {
            const option = document.createElement('option');
            option.value = scope.url;
            option.text = scope.name;
            urlSelect.appendChild(option);
        });

        urlSelect.addEventListener('change', fetchVulnerabilityData);

    } catch (error) {
        console.error('Error fetching scopes:', error);
    }
});

async function fetchVulnerabilityData() {
    const urlSelect = document.getElementById('scope');
    const url = urlSelect.value;
    console.log('Selected URL:', url);

    const token = localStorage.getItem('jwtToken');

    try {
        const response = await fetch('/api/alerts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched vulnerability data:', data);

        const alertsMap = {
            high: {},
            medium: {},
            low: {},
            informational: {}
        };

        data.highVulnerabilities.forEach(desc => {
            alertsMap.high[desc] = (alertsMap.high[desc] || 0) + 1;
        });

        data.mediumVulnerabilities.forEach(desc => {
            alertsMap.medium[desc] = (alertsMap.medium[desc] || 0) + 1;
        });

        data.lowVulnerabilities.forEach(desc => {
            alertsMap.low[desc] = (alertsMap.low[desc] || 0) + 1;
        });

        data.informationalVulnerabilities.forEach(desc => {
            alertsMap.informational[desc] = (alertsMap.informational[desc] || 0) + 1;
        });

        console.log('Aggregated alerts map:', alertsMap);

        const processedData = [];

        Object.entries(alertsMap.high).forEach(([name, count]) => {
            processedData.push({
                x: -1 + (Math.random() * 0.4),
                y: 1 + (Math.random() * 0.4),
                name: name,
                z: count * 10,
                color: 'red'
            });
        });

        Object.entries(alertsMap.medium).forEach(([name, count]) => {
            processedData.push({
                x: 1 + (Math.random() * 0.4),
                y: 1 + (Math.random() * 0.4),
                name: name,
                z: count * 10,
                color: 'orange'
            });
        });

        Object.entries(alertsMap.low).forEach(([name, count]) => {
            processedData.push({
                x: -1 + (Math.random() * 0.4),
                y: -1 + (Math.random() * 0.4),
                name: name,
                z: count * 10,
                color: 'yellow'
            });
        });

        Object.entries(alertsMap.informational).forEach(([name, count]) => {
            processedData.push({
                x: 1 + (Math.random() * 0.4),
                y: -1 + (Math.random() * 0.4),
                name: name,
                z: count * 10,
                color: 'blue'
            });
        });

        console.log('Processed data for chart:', processedData);


    Highcharts.chart('containerFetch', {
        chart: {
            type: 'bubble',
            zoomType: 'xy'
        },
        title: {
            text: 'Vulnerability Quadrants'
        },
        credits: {
            enabled: false // Disable the Highcharts credits (logo)
        },
        xAxis: {
            title: {
                text: ''
            },
            gridLineWidth: 1,
            min: -2,
            max: 2,
            tickInterval: 1,
            labels: {
                enabled: false // Disable labels on the x-axis
            },
            plotLines: [{
                color: 'black',
                width: 2,
                value: 0
            }]
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineWidth: 1,
            min: -2,
            max: 2,
            tickInterval: 1,
            labels: {
                enabled: false // Disable labels on the y-axis
            },
            plotLines: [{
                color: 'black',
                width: 2,
                value: 0
            }]
        },
        series: [{
            name: 'Vulnerabilities',
            data: processedData,
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                    color: 'black',
                    textOutline: 'none'
                }
            },
            colorByPoint: true // Automatically apply colors based on the data
        }, {
            name: 'High Vulnerabilities',
            color: 'red',
            data: [], // No actual data points
            visible: true // Start visible
        }, {
            name: 'Medium Vulnerabilities',
            color: 'orange',
            data: [], // No actual data points
            visible: true // Start visible
        }, {
            name: 'Low Vulnerabilities',
            color: 'yellow',
            data: [], // No actual data points
            visible: true // Start visible
        }, {
            name: 'Informational Vulnerabilities',
            color: 'blue',
            data: [], // No actual data points
            visible: true // Start visible
        }],
        plotOptions: {
            bubble: {
                minSize: 15,
                maxSize: 50,
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.name}</b>'
                }
            },
            series: {
                events: {
                    legendItemClick: function (event) {
                        // Toggle the visibility of the clicked series
                        this.setVisible(!this.visible);
                        return false; // Prevent default action (do not toggle other series)
                    }
                }
            }
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            floating: false, // Set to false to position it at the bottom
            backgroundColor: 'white',
            borderColor: '#ccc',
            borderWidth: 1,
            shadow: false,
            itemStyle: {
                fontWeight: 'normal',
                fontSize: '12px' // Optional: Adjust the font size
            },
            y: 20 // Adjust as necessary to position the legend
        }
    });
    
    
        console.log('Chart successfully created.');

    } catch (error) {
        console.error('Error fetching vulnerability data:', error);
    }
}
