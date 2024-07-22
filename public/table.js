async function fetchData() {
    try {
        const token = localStorage.getItem('jwtToken');

        // Set up fetch request with headers
        const response = await fetch('/history', {
            method: 'GET', // specify the HTTP method
            headers: {
                'Authorization': `Bearer ${token}`, // include the retrieved token in the Authorization header
                'Content-Type': 'application/json' // adjust content type if necessary
                // add more headers as needed
            }
        });

        // Handle the response
        if (response.ok) {
            const data = await response.json(); // or response.text() depending on the response content
            console.log(data);

            const tableBody = document.querySelector('#historyTable');
            tableBody.innerHTML = ''; // Clear existing table rows

            data.forEach(item => {
                const row = document.createElement('tr');
                const urlCell = document.createElement('td');
                const dateCell = document.createElement('td');

                urlCell.textContent = item.url;

                const date = new Date(item.date); // Assuming `date` field exists
                const formattedDate = date.toLocaleString(); // Convert to a readable format

                dateCell.textContent = formattedDate;

                row.appendChild(urlCell);
                row.appendChild(dateCell);
                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

window.onload = fetchData;