// Fetch available URLs and populate the dropdown
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage

    try {
        // Fetch scopes or URLs with authorization header
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
        const urlSelect = document.getElementById('urlSelect');

        data.forEach(scope => {
            const option = document.createElement('option');
            option.value = scope.url; // Assuming scope contains url field
            option.text = scope.name; // Assuming scope contains name field
            urlSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching scopes:', error);
    }
});

// Function to fetch total alerts and plot the chart
async function fetchTotalAlerts() {
    const urlSelect = document.getElementById('urlSelect');
    const url = urlSelect.value;
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage

    try {
        const response = await fetch('/total-alerts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url }) // Send the selected URL in the request body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched total vulnerabilities data:', data); // Log fetched data for debugging

        // Prepare data for Highcharts
        const dates = data.dates;
        const totalAlerts = data.totalAlerts;

        // Create the Highcharts chart
        Highcharts.chart('container', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: 'Vulnerabilities Overview'
            },
            xAxis: {
                categories: dates,
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Total Vulnerabilities'
                }
            },
            series: [{
                name: 'Total Vulnerabilities',
                data: totalAlerts,
                marker: {
                    enabled: true
                }
            }],
            tooltip: {
                shared: true,
                pointFormat: '<b>{point.y}</b>'
            }
        });
    } catch (error) {
        console.error('Error fetching total alerts:', error);
    }
}

// Attach event listener to the button
document.getElementById('fetchDataBtn').addEventListener('click', fetchTotalAlerts);
