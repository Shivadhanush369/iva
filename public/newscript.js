const  sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');


const themeToggler = document.querySelector('.theme-toggler');



menuBtn.addEventListener('click',()=>{
       sideMenu.style.display = "block"
})
closeBtn.addEventListener('click',()=>{
    sideMenu.style.display = "none"
})

themeToggler.addEventListener('click',()=>{
     document.body.classList.toggle('dark-theme-variables')
     themeToggler.querySelector('span:nth-child(1').classList.toggle('active')
     themeToggler.querySelector('span:nth-child(2').classList.toggle('active')
})

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        window.location.href = '/'; // Redirect to your login page
    }
});

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
    fetchTableData(scopeSelect.value);
    fetchAndDisplayAlerts(scopeSelect.value);
    donutchart(scopeSelect.value);
    fetchAndUpdateChart(scopeSelect.value);
    updateAlertCountForScope(scopeSelect.value);
    
}
function populateTable(scan) {
   
   
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear any existing rows

    scan.forEach(scan => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
        <td><input type="checkbox" value="${scan.scanid}"/></td>
        <td>${scan.scanid}</td>
            <td> <a href="${scan.url}">${scan.url}</a></td>
            <td>${scan.username}</td>
            <td>${scan.scan_profile}</td>
            <td>${scan.date}</td>
            <td>
                <span class="badge badge-danger" title="High">${scan.vulnerability.High}</span>
                <span class="badge badge-warning" title="Medium">${scan.vulnerability.Medium}</span>
                <span class="badge badge-secondary" title="Low">${scan.vulnerability.Low}</span>
                
            </td>    
        `;

        tbody.appendChild(row);

         const highBadge = row.querySelector('.badge-danger');
    const mediumBadge = row.querySelector('.badge-warning');
    const lowBadge = row.querySelector('.badge-secondary');

    highBadge.addEventListener('click', () => handleBadgeClick(scan.filteredAlerts.high));
    mediumBadge.addEventListener('click', () => handleBadgeClick(scan.filteredAlerts.medium));
    lowBadge.addEventListener('click', () => handleBadgeClick(scan.filteredAlerts.low));
    });

}

async function fetchTableData(Url) {
    try {
        const token = localStorage.getItem('jwtToken');

        const bodydata= {
            url:Url
        };

        // Set up fetch request with headers
        const response = await fetch('/history', {
            method: 'POST', // specify the HTTP method
            headers: {
                'Authorization': `Bearer ${token}`, // include the retrieved token in the Authorization header
                'Content-Type': 'application/json' // adjust content type if necessary
                // add more headers as needed
            },
            body: JSON.stringify(bodydata)
        });

        // Handle the response
        if (response.ok) {
            const data = await response.json(); // or response.text() depending on the response content
            populateTable(data);
        }
    }  catch (error) {
        console.error('Error fetching data:', error);
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
           
            const totalScansH3 = document.querySelector('.scans .middle .left h1');
            totalScansH3.innerHTML=data.urlCount;
            
        } else {
            console.error('urlCount is undefined or data is invalid:', data);
        }
    } catch (error) {
        console.error('Error fetching issues:', error);
    }
}


async function updateAlertCountForScope(scopeUrl) {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage

    try {
        const response = await fetch('/alertCount', {
            method: 'POST', // Ensure the method matches your endpoint
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json' // Adjust content type if necessary
            },
            body: JSON.stringify({ url: scopeUrl }) // Send URL in the request body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Full Response Data:', data); // Log the full response data
        const alertCount = data.alertCount; // Ensure this is the correct property
        console.log('Alert Count:', alertCount); // Debug log
        const totalScansH3 = document.querySelector('.alerts .middle .left h1');
        totalScansH3.innerHTML=alertCount;

    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
}



async function fetchAndDisplayAlerts(Url) {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/getIssues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url:Url })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        const cardLeft = document.querySelector('.card-left');
        const cardRight = document.querySelector('.card-right');

        // Track the count of each alert name
        const alertCounts = data.reduce((acc, alert) => {
            acc[alert.alertName] = (acc[alert.alertName] || 0) + 1;
            return acc;
        }, {});

        // Clear previous content
        cardLeft.innerHTML = '<div class="card-header">Issues</div>';

        // Populate the left card with alert names and counts
        Object.keys(alertCounts).forEach(alertName => {
            const nameDiv = document.createElement('div');
            nameDiv.classList.add('name');
            nameDiv.innerHTML = `${alertName} <span class="name-count">(${alertCounts[alertName]})</span>`;
            
            // Handle click event to display details
            nameDiv.addEventListener('click', () => {
                const selectedAlert = data.find(alert => alert.alertName === alertName);
                if (selectedAlert) {
                    cardRight.innerHTML = `
                        <div class="risk-box ${getRiskClass(selectedAlert.riskdesc)}">
                            ${selectedAlert.riskdesc}
                        </div>
                        <div class="details-section">
                            <h2>Issue Details</h2>
                            <p><strong>Alert Name:</strong> ${selectedAlert.alertName}</p>
                            <p><strong>Description:</strong> ${selectedAlert.description}</p>
                            <p><strong>Risk Description:</strong> ${selectedAlert.riskdesc}</p>
                            <p><strong>Solution:</strong> ${selectedAlert.solution}</p>
                            <p><strong>CWE ID:</strong> ${selectedAlert.cweid}</p>
                            <p><strong>WASC ID:</strong> ${selectedAlert.wascid}</p>
                        </div>
                    `;
                }
            });

            cardLeft.appendChild(nameDiv);
        });

    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
}

// Function to get the class based on risk description
function getRiskClass(riskdesc) {
    // Convert riskdesc to lowercase for case-insensitive comparison
    const desc = riskdesc.toLowerCase();
    if (desc.includes('high')) {
        return 'risk-high';
    } else if (desc.includes('medium')) {
        return 'risk-medium';
    } else if (desc.includes('low')) {
        return 'risk-low';
    } else {
        return ''; // Default class if no known risk level is found
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        window.location.href = '/'; // Redirect to your login page
    }
    else{
        const profile = document.querySelector('.profile .info p');
        profile.innerHTML =username;
    }
});
 
/* new code  */


document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
  
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const page = e.currentTarget.getAttribute('data-page');
  
        // Fetch content based on clicked link
        fetch(`/path/to/partial?name=${page}`)
          .then(response => response.text())
          .then(data => {
            document.getElementById('middle-content').innerHTML = data;
            
            // Update the active state
            sidebarLinks.forEach(item => item.classList.remove('active'));
            e.currentTarget.classList.add('active');
          });
      });
    });
  });
  