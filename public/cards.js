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

        // Call the function to fetch data and update the DOM when the page loads
        // window.onload = fetchAndDisplayAlerts;



        
        
        
      

          
                
              
                