document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    console.log('Token retrieved:', token);

    try {
        // Fetch alerts with authorization header
        const response = await fetch('/api/alerts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Use backticks for template literals
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched alerts data:', data);

        // Process the alerts data
        processAlertsData(data);

    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
});

// Function to process the fetched alerts data
function processAlertsData(data) {
    // Display the username and URL
    const usernameDisplay = document.getElementById('usernameDisplay');
    const urlDisplay = document.getElementById('urlDisplay');

    if (usernameDisplay && urlDisplay) {
        usernameDisplay.textContent = `Username: ${data.username}`;
        urlDisplay.textContent = `URL: ${data.url}`;
    }

    // Prepare data for Highcharts
    const processedData = [];

    // Process high vulnerabilities
    data.highVulnerabilities.forEach((desc) => {
        processedData.push({
            severity: 'High',
            description: desc,
            tooltip: `High Vulnerability: ${desc}`
        });
    });

    // Process medium vulnerabilities
    data.mediumVulnerabilities.forEach((desc) => {
        processedData.push({
            severity: 'Medium',
            description: desc,
            tooltip: `Medium Vulnerability: ${desc}`
        });
    });

    // Process low vulnerabilities
    data.lowVulnerabilities.forEach((desc) => {
        processedData.push({
            severity: 'Low',
            description: desc,
            tooltip: `Low Vulnerability: ${desc}`
        });
    });

    // Process informational vulnerabilities
    data.informationalVulnerabilities.forEach((desc) => {
        processedData.push({
            severity: 'Informational',
            description: desc,
            tooltip: `Informational Vulnerability: ${desc}`
        });
    });

    console.log('Processed data for chart:', processedData); // Log processed data for debugging

    // Create or update the Highcharts chart
    createVulnerabilityChart(processedData);
}

// Function to create a Highcharts chart for vulnerabilities
function createVulnerabilityChart(vulnerabilities) {
    Highcharts.chart('alertsContainer', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Vulnerabilities Overview'
        },
        xAxis: {
            categories: ['High', 'Medium', 'Low', 'Informational'],
            title: {
                text: 'Vulnerability Severity'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Vulnerabilities'
            }
        },
        series: [{
            name: 'Vulnerabilities',
            data: [
                vulnerabilities.filter(v => v.severity === 'High').length,
                vulnerabilities.filter(v => v.severity === 'Medium').length,
                vulnerabilities.filter(v => v.severity === 'Low').length,
                vulnerabilities.filter(v => v.severity === 'Informational').length
            ]
        }],
        tooltip: {
            formatter: function () {
                const severity = this.x;
                const count = this.point.y;
                return `<b>${severity}</b>: ${count} vulnerabilities`;
            }
        }
    });

    console.log('Chart successfully created.'); // Confirm chart creation
}
