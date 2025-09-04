# Data Dashboard

This is a full-stack web application that displays an interactive data dashboard. The application features user authentication and dynamic charts that visualize global development data from the World Bank Open Data API.

## Deployed Application

[Live Url](https://dashboard-project-f5u7.onrender.com)

[Github Repo](https://github.com/asthaade/dashboard_project)

## Technologies Used

## Frontend

- **HTML5:** For the application's structure.
- **CSS3:** For custom styling and responsive design.
- **JavaScript (ES6+):** For all client-side logic and API communication.
- **Chart.js:** A powerful and flexible JavaScript library used to render the interactive charts.

## Backend

- **Node.js:** The JavaScript runtime environment for the server.
- **Express.js:** A minimalist web framework for building the backend API.
- **jsonwebtoken:** A library for creating and verifying JSON Web Tokens (JWT) for secure authentication.
- **bcryptjs:** Used to securely hash user passwords.
- **cors:** A Node.js middleware for enabling Cross-Origin Resource Sharing.
- **dotenv:** To manage environment variables securely.

## Features
- **Authentication:** Users can securely log in and log out. Access to the dashboard is restricted to authenticated users via a JWT.
- **Dashboard:** The dashboard displays two interactive charts:

  **Bar Chart:** Visualizes population growth over several years.
  
  **Line Chart:** Shows GDP per capita trends over time.

- **Dynamic Data:** All chart data is dynamically fetched from a Node.js backend API, which in turn retrieves real-time data from the World Bank Open Data API.
- **bcryptjs:** Used to securely hash user passwords.
- **Data Filtering:** The dashboard includes a filter that allows the user to select and view data for different countries (USA, China, and India).

## Setup Instructions

### Installation

1. **Clone the repo:**
   ```sh
   git clone https://github.com/asthaade/dashboard_project.git
   ```
2. **Run the Backend:**

   ```sh
   cd server
   npm install
   npm start

   ```
- **Login Credentials:** testuser / password123

3. **Run the Frontend:**
   ```sh
   cd ../client
   # Open index.html in your browser or use a simple server like 'serve'
   npm install -g serve
   serve .

   ```

## API & Data
 - The backend fetches data from the World Bank Open Data API for:
 ```sh
 SP.POP.GROW (Population Growth)
 NY.GDP.PCAP.CD (GDP per Capita)
 ```

## Known Issues
- **CORS errors:** May occur if the backend server isn't running.

- **Rate limits:** The World Bank API has usage limits, so data may not always load on the first attempt after many requests.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request (`we will merge within 24 hour`)

Astha Ade - [GitHub](https://github.com/asthaade)

Project Link: [https://github.com/asthaade/dashboard_project.git](https://github.com/asthaade/dashboard_project.git)

