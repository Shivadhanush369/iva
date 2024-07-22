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
function toggleCustomInput() {
    const scopeSelect = document.getElementById('scope');
    const customScopeInput = document.getElementById('customScope');
    fetchAndDisplayAlerts(scopeSelect.value);
}