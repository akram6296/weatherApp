const apiKey = 'ca1fcbc6a95b2ce205a2977eb9263143';
const weatherBtn = document.getElementById('getWeatherBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('cityInput');
const resultDiv = document.getElementById('weatherResult');

weatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    resultDiv.textContent = 'Please enter a city name.';
  }
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const location = await getCityFromCoordinates(lat, lon);
      cityInput.value = location;
      getWeather(location);
    }, () => {
      resultDiv.textContent = 'Unable to retrieve your location.';
    });
  } else {
    resultDiv.textContent = 'Geolocation is not supported by your browser.';
  }
});

async function getCityFromCoordinates(lat, lon) {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await res.json();
    return data.city || data.locality || 'Unknown';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Unknown';
  }
}

async function getWeather(city) {
  try {
    resultDiv.textContent = 'Fetching weather...';
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod === 200) {
      resultDiv.innerHTML = `
        <strong>${data.name}, ${data.sys.country}</strong><br>
        ${data.weather[0].main} (${data.weather[0].description})<br>
        🌡️ Temp: ${data.main.temp}°C<br>
        💧 Humidity: ${data.main.humidity}%<br>
        🌬️ Wind: ${data.wind.speed} m/s
      `;
    } else {
      resultDiv.textContent = 'City not found.';
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    resultDiv.textContent = 'Error fetching weather data.';
  }
}
async function getWeather(city) {
  try {
    resultDiv.textContent = 'Fetching weather...';
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod === 200) {
      const weatherType = data.weather[0].main.toLowerCase();

      // Apply weather class to body
      document.body.className = ''; // reset
      if (['clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'mist'].includes(weatherType)) {
        document.body.classList.add(weatherType);
      }

      resultDiv.innerHTML = `
        <strong>${data.name}, ${data.sys.country}</strong><br>
        ${data.weather[0].main} (${data.weather[0].description})<br>
        🌡️ Temp: ${data.main.temp}°C<br>
        💧 Humidity: ${data.main.humidity}%<br>
        🌬️ Wind: ${data.wind.speed} m/s
      `;
    } else {
      resultDiv.textContent = 'City not found.';
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    resultDiv.textContent = 'Error fetching weather data.';
  }
}
