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
        const scopeSelect = document.getElementById('analyticscope');

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


async function toggleanalytics() {
   
    const scopeSelect = document.getElementById('analyticscope');
    const url = scopeSelect.value;

    try {
        const token = localStorage.getItem('jwtToken');

        const bodydata = {
            url: url
        };

        // Set up fetch request with headers
        const response = await fetch('/analytics', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Authorization': `Bearer ${token}`, // Include the retrieved token in the Authorization header
                'Content-Type': 'application/json' // Adjust content type if necessary
            },
            body: JSON.stringify(bodydata)
        });

        // Handle the response
        if (response.ok) {
            const data = await response.json(); // Assuming the response is JSON

            // Extract data for Highcharts
            const dates = data.dates;
            const highVulnerabilities = data.highVulnerabilities;
            const mediumVulnerabilities = data.mediumVulnerabilities;
            const lowVulnerabilities = data.lowVulnerabilities;

            // Update Highcharts
            Highcharts.chart('chart-container', {
                chart: {
                    type: 'spline' ,// Change to spline chart
                    width: 600, // Adjust the width
                    height: 400,
                    events: {
                        load: function () {
                            // Apply border styling after the chart is rendered
                            document.getElementById('chart-container').style.border = '2px solid grey';
                        }
                    }
                
                },
                title: {
                    text: 'Risk Level Counts Over Time',
                    align: 'left'
                },
                xAxis: {
                    categories: dates, // Use dynamic dates
                    title: {
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Count'
                    }
                },
                tooltip: {
                    shared: true, // Set to true to allow multiple series tooltips
                    formatter: function () {
                        var points = this.points;
                        var tooltipText = '<b>' + this.x + '</b><br/>';

                        // Initialize counters for individual risk levels
                        var highRiskValue = 0;
                        var mediumRiskValue = 0;
                        var lowRiskValue = 0;

                        // Iterate through points to extract values for each series
                        points.forEach(function (point) {
                            if (point.series.name === 'High Risk') {
                                highRiskValue = point.y;
                            } else if (point.series.name === 'Medium Risk') {
                                mediumRiskValue = point.y;
                            } else if (point.series.name === 'Low Risk') {
                                lowRiskValue = point.y;
                            }
                        });

                        tooltipText += '<span style="color:#FF7F7F">High Risk: ' + highRiskValue + '</span><br/>';
                        tooltipText += '<span style="color:#E1AD01">Medium Risk: ' + mediumRiskValue + '</span><br/>';
                        tooltipText += '<span style="color:green">Low Risk: ' + lowRiskValue + '</span><br/>';

                        return tooltipText;
                    }
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true, // Show symbols at data points
                            radius: 5, // Size of the symbol
                            symbol: 'circle' // Type of symbol
                        }
                    }
                },
                series: [{
                    name: 'High Risk',
                    data: highVulnerabilities, // Use dynamic data
                    color: '#FF7F7F'     // Color for High Risk
                }, {
                    name: 'Medium Risk',
                    data: mediumVulnerabilities, // Use dynamic data
                    color: '#E1AD01'     // Color for Medium Risk (Mustard Yellow)
                }, {
                    name: 'Low Risk',
                    data: lowVulnerabilities,  // Use dynamic data
                    color: 'green'     // Color for Low Risk
                }],
                credits: {
                    enabled: false // Disable the highcharts.com watermark
                }
            });
        } else {
            console.error('Error response from server:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Attach event listener to a button or similar trigger
document.getElementById('fetchDataBtn').addEventListener('click', toggleanalytics);
