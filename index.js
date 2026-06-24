
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const errorMessage = document.getElementById('error-message');


const city = "";
const API_KEY = "7GHHXN3SRSTFLXYDH4FNC2GCP";

function handleCityInput(event) {
    if (event.key === 'Enter') {
        const city = event.target.value;
        getWeather(city, API_KEY);
    }
};

function getCityInput() {
    const city = cityInput.value;
    getWeather(city, API_KEY);
};

async function getWeather(city, API_KEY) {
    try {
        const response = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}&unitGroup=metric&include=days`);
        const data = response.data;
        errorMessage.textContent = "";
        handleWeatherData(data);
    } catch (error) { 
        if (error.response) {
            console.error("API Error:", error.response.data);
            weatherContainer.innerHTML = "";
            errorMessage.textContent = "Could not fetch weather data. Please check the city name and try again.";
        } else {
            console.error("Network Error:", error.message);
            weatherContainer.innerHTML = "";
            errorMessage.textContent = "Network error: " + error.message;
        }  
        console.error("Error fetching weather data:", error);
    }
};

async function getWeatherForecast(data) {

    weatherContainer.innerHTML += `
        <div class="forecast-card">
            ${data.days.map(day => `
                <div class="forecast-day">
                    <iconify-icon 
                        icon='${forecastIcon(day.icon)}'
                        style="font-size: 40px; color: #2117b0;">
                    </iconify-icon>
                    <div class="forecast-info">
                        <h4>${formatForecastDate(day.datetime)}</h4>
                        <p>Temperature: ${day.temp}°C</p>
                        <p>Condition: ${day.conditions}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

function handleWeatherData(data) {
    weatherContainer.innerHTML = `
        <div class="weather-card">
            <div class="weather-info">
                <h3>Weather in ${data.resolvedAddress}</h3>
                <p>Temperature: ${data.days[0].temp}°C</p>
                <p>Condition: ${data.days[0].conditions}</p>
                <p>Details: ${data.days[0].description}</p>
                <p>Humidity: ${data.days[0].humidity}%</p>
                <p>Wind Speed: ${data.days[0].windspeed} km/h</p>
                <p>Precipitation: ${data.days[0].precip} mm</p>
                <p>Visibility: ${data.days[0].visibility} km</p>
                <p>UV Index: ${data.days[0].uvindex}</p>
                <p>Sunrise: ${data.days[0].sunrise}</p>
                <p>Sunset: ${data.days[0].sunset}</p>
            </div>
            <div class="weather-icon-container">
                <iconify-icon 
                    icon='${forecastIcon(data.days[0].icon)}'
                    style="font-size: 100px; color: #2117b0;">
                </iconify-icon>
                <button id="weather-forecast-btn">View Forecast</button>
            </div>
        </div>
    `;

    document.getElementById('weather-forecast-btn').addEventListener('click', () => {
        const city = cityInput.value;
        getWeatherForecast(data);
    });
}

function formatForecastDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options = { 
        weekday: 'short',  
        month: 'long',    
        day: 'numeric'    
    };
    return date.toLocaleDateString('en-US', options);
}

function forecastIcon(condition) {

    const conditionIcons = {
    "clear-day": "lucide:sun",
    "clear-night": "lucide:moon",
    "cloudy": "lucide:cloud",
    "cloudy-day": "lucide:cloud",
    "cloudy-night": "lucide:cloud",
    "partly-cloudy-day": "lucide:cloud-sun",
    "partly-cloudy-night": "lucide:cloud-moon",
    "fog": "lucide:cloud-fog",
    "wind": "lucide:wind",
    "rain": "lucide:cloud-rain",
    "showers-day": "lucide:cloud-drizzle",
    "showers-night": "lucide:cloud-drizzle",
    "snow": "lucide:snowflake",
    "snow-showers-day": "lucide:cloud-snow",
    "snow-showers-night": "lucide:cloud-snow",
    "sleet": "lucide:cloud-hail",
    "hail": "lucide:cloud-hail",
    "thunder": "lucide:cloud-lightning",
    "thunder-rain": "lucide:cloud-lightning",
    "thunder-showers-day": "lucide:cloud-lightning",
    "thunder-showers-night": "lucide:cloud-lightning",
    "rain-snow": "lucide:cloud-rain-wind", 
    "rain-snow-showers-day": "lucide:cloud-rain-wind",
    "rain-snow-showers-night": "lucide:cloud-rain-wind"
};
    return conditionIcons[condition] || 'lucide:question-mark';
}

addEventListener('DOMContentLoaded', () => {
    cityInput.addEventListener('keypress', handleCityInput);
    document.getElementById('weather-btn').addEventListener('click', getCityInput);
    
});


export { getWeather, handleWeatherData, formatForecastDate, forecastIcon };