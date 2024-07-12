document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission for now
    
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value.trim();
    alert(email+" "+password);
    // Make POST request to login endpoint
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        const token = data.token;
        localStorage.setItem("jwtToken",token);
        localStorage.setItem("username",data.username);
        // Handle successful login
        console.log('Login successful:', data);
        alert('Login successful!'); // Example alert, replace with UI feedback
        // Redirect to dashboard or next page
        window.location.href = '/dashboard.html'; // Adjust the URL as per your setup
    })
    .catch(error => {
        // Handle login errors
        console.error('Error during login:', error.message);
        alert('Login failed. Please check your credentials.'); // Example alert, replace with UI feedback
    });
});