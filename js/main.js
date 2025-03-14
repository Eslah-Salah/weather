// Fetch and display weather data with debouncing
let debounceTimeout;

async function fetchWeather(query) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=51e07ac6390a47dd860201755242912&q=${query}&days=3`);
            if (response.ok) {
                const data = await response.json();
                displayToday(data.location, data.current);
                displayForecast(data.forecast.forecastday);
            } else {
                showError("City not found. Please try again.");
            }
        } catch (error) {
            showError("Error fetching weather data. Check your connection.");
            console.error("Error fetching weather data:", error);
        }
    }, 500);
}

// Display today's weather
function displayToday(location, current) {
    if (!current) return;
    
    const date = new Date(current.last_updated);
    const todayHTML = `
        <div class="today forecast">
            <div class="forecast-header">
                <div class="day">${days[date.getDay()]}</div>
                <div class="date">${date.getDate()} ${monthNames[date.getMonth()]}</div>
            </div>
            <div class="forecast-content">
                <div class="location">${location.name}, ${location.country}</div>
                <div class="degree">
                    <div class="num">${current.temp_c}<sup>o</sup>C</div>
                    <img src="https:${current.condition.icon}" alt="Weather Icon" width="90">
                </div>
                <div class="custom">${current.condition.text}</div>
                <span><img src="images/icon-umberella.png" alt=""> ${current.humidity}%</span>
                <span><img src="images/icon-wind.png" alt=""> ${current.wind_kph} km/h</span>
                <span><img src="images/icon-compass.png" alt=""> ${current.wind_dir}</span>
            </div>
        </div>`;
    
    document.getElementById("forecast").innerHTML = todayHTML;
}

// Display forecast for the next days
function displayForecast(forecastDays) {
    let forecastHTML = "";
    for (let i = 1; i < forecastDays.length; i++) {
        const date = new Date(forecastDays[i].date);
        forecastHTML += `
            <div class="forecast">
                <div class="forecast-header">
                    <div class="day">${days[date.getDay()]}</div>
                </div>
                <div class="forecast-content text-center">
                    <img src="https:${forecastDays[i].day.condition.icon}" alt="Weather Icon" width="48">
                    <div class="degree">${forecastDays[i].day.maxtemp_c}<sup>o</sup>C</div>
                    <small>${forecastDays[i].day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${forecastDays[i].day.condition.text}</div>
                </div>
            </div>`;
    }
    
    document.getElementById("forecast").innerHTML += forecastHTML;
}

// Show error message
function showError(message) {
    document.getElementById("forecast").innerHTML = `<div class="error-message">${message}</div>`;
}

// Add event listener for search input
document.getElementById("search").addEventListener("keyup", event => {
    fetchWeather(event.target.value);
});

// Day and month names
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Fetch default weather for Cairo
fetchWeather("Cairo");



