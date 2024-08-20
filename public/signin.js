let notifications = document.querySelector('.notification');
document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission for now
    
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value.trim();
   
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
        let type = 'success';
        let icon = 'fa-solid fa-circle-check';
        let title = 'Success';
        let text = 'Login successfull';
        createToast(type, icon, title, text);
        
         // Example alert, replace with UI feedback
        // Redirect to dashboard or next page
        setTimeout(() => {
            window.location.href = '/dashboard.html'; // Adjust the URL as per your setup
        }, 5000); // Adjust the URL as per your setup
    })
    .catch(error => {
        // Handle login errors
        console.error('Error during login:', error.message);
        let type = 'error';
        let icon = 'fa-solid fa-xmark';
        let title = 'Failed';
        let text = 'Login failed. Please check your credentials.';
        createToast(type, icon, title, text);
        
       
    });
});




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