const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const API_KEY = 'ENTER_YOUR_API_KEY_HERE';

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    console.log('Requested cities:', cities);
    const weatherData = await getWeatherData(cities);
    console.log('Weather data:', weatherData);
    res.json({ weather: weatherData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


async function getWeatherData(cities) {
  const weatherData = {};

  // Iterate over each city and fetch its weather
  for (const city of cities) {
    const temperature = await fetchTemperature(city);
    weatherData[city] = temperature;
  }

  return weatherData;
}

async function fetchTemperature(city) {
  try {
    const apiUrl = 'https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}';
    const response = await axios.get(apiUrl);
    const { temp_c } = response.data.current;
    return '${temp_c}C';
  } catch (error) {
    console.error('Error fetching weather for ${city}:', error);
    return 'N/A';
  }
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
