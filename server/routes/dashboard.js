const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // You need to install this package: npm install node-fetch@2

// Helper function to fetch data from the World Bank API
async function fetchWorldBankData(indicatorCode) {
    // We are fetching data for the USA, China, and India for the years 2018 to 2022
    const countries = 'USA;CHN;IND';
    const years = '2018:2022';
    const url = `https://api.worldbank.org/v2/country/${countries}/indicator/${indicatorCode}?date=${years}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Error fetching data from World Bank API:', response.statusText);
            return null;
        }
        const data = await response.json();
        // The API returns an array, with the second element containing the data
        return data[1] || [];
    } catch (error) {
        console.error('Network or parsing error:', error);
        return null;
    }
}

// Function to process the raw API data into our desired format
function processData(rawPopulationData, rawGdpData) {
    const processedData = {};

    // Process Population data
    if (rawPopulationData) {
        rawPopulationData.forEach(item => {
            if (!processedData[item.country.id]) {
                processedData[item.country.id] = { country: item.country.value, data: [] };
            }
            if (item.value !== null) {
                processedData[item.country.id].data.push({
                    year: parseInt(item.date),
                    population_growth: item.value,
                    gdp_per_capita: 0 // Placeholder
                });
            }
        });
    }

    // Process GDP data and merge with population data
    if (rawGdpData) {
        rawGdpData.forEach(item => {
            if (processedData[item.country.id] && item.value !== null) {
                const yearData = processedData[item.country.id].data.find(d => d.year === parseInt(item.date));
                if (yearData) {
                    yearData.gdp_per_capita = item.value;
                }
            }
        });
    }

    // Convert the object back to an array
    const finalArray = Object.values(processedData);

    // Filter out countries with incomplete data and sort by country
    return finalArray.filter(country => country.data.length > 0)
                      .sort((a, b) => a.country.localeCompare(b.country));
}

// Protected Dashboard Data Route
router.get('/dashboard-data', async (req, res) => {
    // You must install the 'node-fetch' package for this to work.
    // Run 'npm install node-fetch@2' in your terminal in the server directory.
    const populationData = await fetchWorldBankData('SP.POP.GROW');
    const gdpData = await fetchWorldBankData('NY.GDP.PCAP.CD');

    if (populationData === null || gdpData === null) {
        return res.status(500).json({ message: 'Failed to fetch data from the World Bank API.' });
    }

    const dashboardData = processData(populationData, gdpData);
    res.json(dashboardData);
});

module.exports = router;
