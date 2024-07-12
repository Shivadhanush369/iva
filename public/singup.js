document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission for now
    
    // Clear previous errors
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validate email
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    
    if (!isValidEmail(email)) {
        document.getElementById('emailError').textContent = 'Invalid email format';
        return;
    }

    // Validate password
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmpassword').value.trim();
    
    if (password !== confirmPassword) {
        document.getElementById('passwordError').textContent = 'Passwords do not match';
        return;
    }
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    // Submit form data to server
    fetch('/Register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
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
        spinner.innerHTML='<p>register successfull</p>';
        // Handle successful registration
       
    })
    .catch(error => {
        spinner.innerHTML='<p>register failed</p>';
        // Handle errors
        console.error('Error during registration:', error.message);
    });
   
});

function isValidEmail(email) {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
