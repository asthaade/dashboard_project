// Function to show/hide pages
function showPage(pageId) {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('login-message');

    try {
        const response = await fetch('https://dashboard-backend-ibe9.onrender.com/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            messageElement.classList.add('hidden');
            renderDashboard();
        } else {
            messageElement.textContent = data.message || 'Login failed.';
            messageElement.classList.remove('hidden');
        }
    } catch (error) {
        messageElement.textContent = 'An error occurred. Please try again.';
        messageElement.classList.remove('hidden');
    }
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('token');
    showPage('login-page');
}

// Global chart variables
let populationChart = null;
let gdpChart = null;

// Function to render the charts
function renderCharts(data) {
    const years = data.map(d => d.year);
    const populationData = data.map(d => d.population_growth);
    const gdpData = data.map(d => d.gdp_per_capita);

    // Destroy existing charts to prevent memory leaks
    if (populationChart) populationChart.destroy();
    if (gdpChart) gdpChart.destroy();

    // Population Growth Bar Chart
    const popCanvas = document.getElementById('population-chart');
    populationChart = new Chart(popCanvas, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Population Growth (%)',
                data: populationData,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // GDP per Capita Line Chart
    const gdpCanvas = document.getElementById('gdp-chart');
    gdpChart = new Chart(gdpCanvas, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'GDP per Capita ($)',
                data: gdpData,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

// Function to fetch data and update dashboard
async function renderDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        handleLogout();
        return;
    }

    try {
        const response = await fetch('https://dashboard-backend-ibe9.onrender.com/api/dashboard-data', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            handleLogout();
            return;
        }

        const data = await response.json();
        const countryFilter = document.getElementById('country-filter');

        // Populate the country filter dropdown
        countryFilter.innerHTML = ''; // Clear previous options
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.country;
            option.textContent = item.country;
            countryFilter.appendChild(option);
        });

        // Set up the initial chart view and filter event listener
        const selectedCountryData = data.find(item => item.country === countryFilter.value);
        if (selectedCountryData) {
            renderCharts(selectedCountryData.data);
        }

        countryFilter.addEventListener('change', (e) => {
            const countryData = data.find(item => item.country === e.target.value);
            if (countryData) {
                renderCharts(countryData.data);
            }
        });

        showPage('dashboard-page');

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        handleLogout();
    }
}

// Initial check on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if a token exists in local storage
    if (localStorage.getItem('token')) {
        renderDashboard();
    } else {
        showPage('login-page');
    }

    // Attach event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
});
