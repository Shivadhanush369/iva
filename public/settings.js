
let notifications = document.querySelector('.notification');

document.addEventListener('DOMContentLoaded', async (event) => {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage

    try {
        // Fetch scope options with authorization header
        const response = await fetch('scopes', {
            method: 'GET', // specify the HTTP method
            headers: {
                'Authorization': `Bearer ${token}`, // include the token in the Authorization header
                'Content-Type': 'application/json' // adjust content type if necessary
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



document.getElementById('settingsForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    // Prevent the default form submission

    // Collect form data
    let scope = document.getElementById('scope').value;
    const cvssScore = document.getElementById('cvssScore').value;
    const scheduleTime = document.getElementById('scheduleTime').value;
    const username = localStorage.getItem("username");
    const customScopeInput = document.getElementById('customScope');
    
    if (scope === '*')
    {
       
        scope = customScopeInput.value;
        if (!scope.startsWith('https://')) {
            
            scope = 'https://' + scope;
        }
        if (!scope.endsWith('/')) {

         
            scope += '/';
        }
    }

    const data = {
        username : username,
        scope: scope,
        cvssScore: cvssScore,
        scheduleTime: scheduleTime
    };

    const token = localStorage.getItem("jwtToken");

    // Perform the API call
    fetch('/settingsb', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // include the retrieved token in the Authorization header
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        
        console.log('Success:', data);
        let type = 'success';
let icon = 'fa-solid fa-circle-check';
let title = 'Success';
let text = 'Submitted Successfully';
createToast(type, icon, title, text);

    })
    .catch(error => {
        
        
        console.error('Error:', error);
        let type = 'error';
        let icon = 'fa-solid fa-xmark';
        let title = 'Failed';
        let text = 'Subbmission failed.';
        createToast(type, icon, title, text);
    });
});

function toggleCustomInput() {
    const scopeSelect = document.getElementById('scope');
    const customScopeInput = document.getElementById('customScope');
    if (scopeSelect.value === '*') {
        customScopeInput.style.display = 'block';
    } else {
        customScopeInput.style.display = 'none';
    }
}


function createToast(type, icon, title, text){
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast ${type}">
            <i class="${icon}"></i>
            <div class="content">
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