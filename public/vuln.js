// Fetch available URLs and populate the dropdown
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    const urlSelect = document.getElementById('scope'); // Select the dropdown element

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

        // Clear the dropdown first
        urlSelect.innerHTML = ''; 

        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = ''; // No value for default
        defaultOption.text = 'Select your scope'; // Default text
        defaultOption.disabled = true; // Make it unselectable
        defaultOption.selected = true; // Set it as selected
        urlSelect.appendChild(defaultOption);

        // Populate the dropdown with fetched scopes
        data.forEach(scope => {
            const option = document.createElement('option');
            option.value = scope.url; // Assuming scope contains url field
            option.text = scope.name; // Assuming scope contains name field
            urlSelect.appendChild(option);
        });

        // Set up event listener for dropdown changes
        urlSelect.addEventListener('change', fetchTotalAlerts);

    } catch (error) {
        console.error('Error fetching scopes:', error);
    }
});

// Function to fetch total alerts and plot the chart
async function fetchTotalAlerts() {
    const urlSelect = document.getElementById('scope');
    const url = urlSelect.value; // Get the selected URL
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage

    // Check if the user has selected a valid scope
    if (!url) {
        console.warn('No scope selected. Please select a scope.');
        return; // Exit the function if no valid option is selected
    }

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
        const dates = data.dates; // Ensure this matches the response structure
        const totalAlerts = data.totalAlerts; // Ensure this matches the response structure

        // Check if dates and totalAlerts are valid arrays
        if (!Array.isArray(dates) || !Array.isArray(totalAlerts) || dates.length !== totalAlerts.length) {
            throw new Error('Data format is invalid. Ensure dates and totalAlerts arrays are of equal length.');
        }

        // Create the Highcharts chart using the specified ID
        Highcharts.chart('containerVuln', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: 'Vulnerabilities Overview'
            },
            credits: {
                enabled: false // Disable the Highcharts credits (logo)
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
