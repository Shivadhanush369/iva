let notifications = document.querySelector('.notification');

function toggleCustomInput() {
    
    const scopeSelect = document.getElementById('scope');


    fetchTableData(scopeSelect.value);


        // Call vulnerability and total alerts functions
        fetchVulnerabilityData(scopeSelect.value); // Call graph.js function
        fetchTotalAlerts(scopeSelect.value); // Call vuln.js function
    
}
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




function populateTable(scan) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear any existing rows

    scan.forEach(scan => {
        // Check if filteredAlerts exists and contains high, medium, and low
        if (scan.filteredAlerts) {
            // Loop through the keys of the filteredAlerts object (high, medium, low)
            Object.keys(scan.filteredAlerts).forEach(key => {
                const alerts = scan.filteredAlerts[key]; // Get the alerts for the current key
                alerts.forEach(vuln => {
                    const buttonClass = vuln.ticketstatus ? 'toggle-btn active' : 'toggle-btn';
                    const buttonText = vuln.ticketstatus ? 'Ticket Created' : 'Create Ticket';
                    const row = document.createElement('tr');

                    row.innerHTML = `
<td>
  <input
    type="checkbox"
    class="row-checkbox"
    data-scanid="${scan.scanid}"
    data-alert="${vuln.name}"
    data-desc="${vuln.description}"
    data-url="${vuln.url}"
    data-parameter="${vuln.param}"
    data-attack="${vuln.attack}"
    data-evidence="${vuln.evidence}"
    data-sourceid="${vuln.sourceid}"
    data-cweid=${vuln.cweid}
    data-wascid=${vuln.wascid}
    data-alertref=${vuln.alertRef}
    data-label=0
  />
</td>
                        <td>${scan.scanid}</td>
                        <td>
                            <a href="${vuln.url}" title="${vuln.url}">
                                ${vuln.url.length > 24 ? vuln.url.substring(0, 24) + '...' : vuln.url}
                            </a>
                        </td>
                        <td>${vuln.risk}</td>
                        <td title="${vuln.name}">
                            ${vuln.name.length > 24 ? vuln.name.substring(0, 24) + '...' : vuln.url}
                        </td>
                        <td>${vuln.risk}</td>
                        <td class="toggle-btn-wrapper">
                            <button class="${buttonClass}" id="toggle-${vuln.url}-${vuln.name}" data-scanid="${scan.scanid}" data-vulname="${vuln.name}" data-vulurl="${vuln.url}">
                                <span class="toggle-ball"></span> 
                                <span class="toggle-content">${buttonText}</span>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            });
        }
    });

    // Fix: Properly select the Confirm False Positive button
    
}

const confirmButton = document.querySelector('.false-positive');
    if (confirmButton) {
        confirmButton.addEventListener('click', () => {
            alert("dsn");
            const checkedRows = document.querySelectorAll('.row-checkbox:checked');
            const selectedData = { data: [] };

            checkedRows.forEach(checkbox => {
                const rowData = {
                   
                    Alert: checkbox.dataset.alert || "",
Description: checkbox.dataset.desc || "",
URL: checkbox.dataset.url || "",
Parameter: checkbox.dataset.parameter || "",
Attack: checkbox.dataset.attack || "",
Evidence: checkbox.dataset.evidence || "",
sourceid: parseInt(checkbox.dataset.sourceid, 10) || "",
  cweid: parseInt(checkbox.dataset.cweid, 10) || "",
  wascid: parseInt(checkbox.dataset.wascid, 10) || "",
  alertRef: parseInt(checkbox.dataset.alertref, 10) || "",
  label: parseInt(checkbox.dataset.label, 10) || 0

                };
                selectedData.data.push(rowData);
                            });

            // Debugging Alerts
            alert("Rows selected: " + JSON.stringify(selectedData));
            // Call the `asshole` function with the selected data
            submitFalsePositive(selectedData);
        });
    }

async function submitFalsePositive(result)
{
alert("in");

    // const falsePositiveData = {
    //     Alert: generateUniqueId(),             // Unique identifier for the operation
    //     Description: new Date().toISOString(), // Current timestamp
    //     URL: result.length,          // Total number of entries marked as false positive
    //     Parameter: "username",            // Example: Username of the person processing
    //     Attack: "Manual Scan UI",           // Source of the submission
    //     Evidence: getRiskLevels(result),  // Breakdown of risk levels (e.g., high, medium, low)
    //     sourceid: result.map(item => item.scanid), // List of unique scan IDs
    //     cweid: result.map(item => item.vulname), // List of vulnerability names
    //     wascid: result.map(item => item.vulurl), // List of affected URLs
    //     alertRef: true,           // Confirmation status
    //     label: "Marked as false positive"   // Optional notes or comments
    // };


    try {
        // Make an API call using fetch
        const response = await fetch('http://127.0.0.1:5001/training', {
            method: 'POST',                       // HTTP method
            headers: {
                'Content-Type': 'application/json' // Specify JSON content
            },
            body: JSON.stringify(result)         // Convert payload to JSON string
        });

        // Check if the response is successful
        if (response.ok) {
            const responseData = await response.json();
            console.log("Response from server:", responseData);
            let icon = 'fa-solid fa-circle-check';
            let title = 'Success';
            let text = 'False Positive submitted successfully!';
            createToast(type, icon, title, text);
        } else {
            console.error("Failed to submit false positive data:", response.statusText);
            let type = 'error';
            let icon = 'fa-solid fa-xmark';
            let title = 'Failed';
            let text = 'False Positive subbmission failed.';  
            createToast(type, icon, title, text);
        }
    } catch (error) {
        console.error("Error during API call:", error);
         }

}


document.querySelector('table tbody').addEventListener('click', function (event) {
    const toggleButton = event.target.closest('.toggle-btn');
    if (toggleButton) { // Match the button, not the checkbox
        

        // Extract vulnerability details from the button's data attributes
        const vulnscanid = toggleButton.getAttribute("data-scanid");
        const vulnName = toggleButton.getAttribute('data-vulname');
        const vulnUrl = toggleButton.getAttribute('data-vulurl');

        // Populate the popup with vulnerability details
        const popup = document.getElementById('popup');
        popup.classList.remove('hidden');

        const ticketScope = document.getElementById("ticketscope");
        const ticketvul = document.getElementById("vulnerabilityscope");
        const ticketscanid = document.getElementById("ticketscanid");

        // Clear existing content in the dropdowns
        ticketScope.innerHTML = '';
        ticketvul.innerHTML = '';
        ticketscanid.innerHTML = '';

        // Create options with extracted details
        const option = document.createElement('option');
        option.value = vulnUrl;
        option.text = vulnUrl;

        const option2 = document.createElement('option');
        option2.value = vulnName;
        option2.text = vulnName;

        const option3 = document.createElement('option');
        option3.value = vulnscanid;
        option3.text = vulnscanid;

        const option4 = document.createElement('option');
        option4.value = "";
        option4.text = "";

        // Append options to dropdowns
        ticketScope.appendChild(option);
        ticketvul.appendChild(option4);
        ticketvul.appendChild(option2);
        ticketscanid.appendChild(option3);

        // Toggle the button's state (add/remove 'active' class)
        // toggleButton.classList.toggle('active');

        // // Optional: Update the text of the button
        // const textSpan = toggleButton.querySelector('span');
        // if (toggleButton.classList.contains('active')) {
        //     textSpan.textContent = 'Ticket Created';  // Update text when toggled on
        // } else {
        //     textSpan.textContent = 'Create Ticket';  // Reset text when toggled off
        // }
    }
});




async function ticketsubmit() {
    const projectKey = 'SCRUM'; // Replace with your actual project key
    const assignee = document.getElementById('asign').value;
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const issuetype = document.getElementById('type').value;
    const scanid = document.getElementById('ticketscanid').value;
    const vulurl = document.getElementById('ticketscope').value;
    const vulname = document.getElementById('vulnerabilityscope').value;

    const body = {
        projectKey,
        assignee,
        summary,
        description,
        issuetype,
        scanid,
        vulurl,
        vulname
    };

    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/raiseticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (response.status === 201) {
           const toggleButton = document.getElementById("toggle-"+summary);
           toggleButton.classList.toggle('active');

           toggleButton.querySelector('.toggle-content').textContent = 'Ticket Created';
           const popup = document.getElementById('popup');
        popup.classList.add('hidden');
        let icon = 'fa-solid fa-circle-check';
let title = 'Success';
let text = 'Ticket submitted successfully!';
createToast(type, icon, title, text);
        } else {
            console.error('Error:', error);
            let type = 'error';
            let icon = 'fa-solid fa-xmark';
            let title = 'Failed';
            let text = 'Ticket subbmission failed.';
            createToast(type, icon, title, text);
        }
    } catch (error) {
        console.error('Error creating ticket:', error);
    }
}


function createToast(type, icon, title, text){
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast ${type}">
            <i class="${icon}"></i>
            <div class="contents">
                <div class="title">${title}</div>
                <span>${text}</span>
            </div>
            <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
        </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(
        ()=>newToast.remove(), 5000
    )
}










document.getElementById('closePopup').addEventListener('click', function () {
    popup.classList.add('hidden');
});

async function ticketscope() {
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
        const scopeSelect = document.getElementById('ticketscope');

        // Clear any existing options
        scopeSelect.innerHTML = '<option value="" disabled selected>Select your scope</option>';

        // Add new options
        data.forEach(scope => {
            const option = document.createElement('option');
            option.value = scope.url;
            option.text = scope.name;
            scopeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching scopes:', error);
        // Optionally: Display an error message to the user
        const scopeSelect = document.getElementById('ticketscope');
        scopeSelect.innerHTML = '<option value="" disabled selected>Error loading scopes</option>';
    }
}

function setTicketSummary(){
    const ticketscope = document.getElementById('ticketscope').value;
    const ticketSelectedVulnerability = document.getElementById('vulnerabilityscope').value
const summary =  document.getElementById('summary');
summary.value=ticketscope+'-'+ticketSelectedVulnerability;
setAssignee();
}

async function setAssignee() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/getAsignee', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const res = await response.json(); // Parse response as JSON
        const scopeSelect = document.getElementById('asign');

        res.data.forEach((user) => {
           
            const option = document.createElement('option');
            option.value = user.accountId; // Use accountId as the option value
            option.text = user.displayName; // Use displayName as the text
            scopeSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching assignees:', error);
    }
}

async function  fetchListOfVulnerability(scope)
{

    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/listvulnerability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url:scope })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        return response.json();

        

    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
}


async function populatevulnerabilityscope(scope) {
    const vulnerabilities = await fetchListOfVulnerability(scope); // Assuming the response is JSON


    const scopeSelect = document.getElementById('vulnerabilityscope');
    vulnerabilities.alertname.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        scopeSelect.appendChild(option);
    });

}





// Close the popup when a close button is clicked
function ticketpopclose() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
}