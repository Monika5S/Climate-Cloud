function currentDateTime(timestamp) {
  let date_str = new Date(timestamp * 1000);
  let day = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  let hours = date_str.getHours();
  let minutes = date_str.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let am_pm = hours < 10 ? " am" : " pm";

  let date_time = document.querySelector("#date-time");
  date_time.innerHTML =
    day[date_str.getDay()] + " " + hours + ":" + minutes + am_pm;
}

function searchCity(event) {
  event.preventDefault();
  var city_input = document.querySelector("#city-input");

  if (city_input.value) {
    let city_name = city_input.value.trim();
    getCityTemperature(city_name);
  } else {
    alert("Please enter a city name");
  }
}

function getForecast(coordinates) {
  let api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${api_key}&units=metric`;
  console.log(api_url);
  axios.get(api_url).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector(".weather-forecast");

  let forecastHTML = '<div class="row">';

  forecastHTML =
    forecastHTML +
    `<div class="col weather-forecast-temperature">
      <img
        class="icon"
        src="http://openweathermap.org/img/wn/10d@2x.png"
      />
      <p id="weather-forecast-day">
        mon
        <span id="weather forecast-temperature">
          <b> 20</b>
        </span>
        °C
      </p>
    </div>`;

  forecastHTML = forecastHTML + "</div>";
  forecastElement.innerHTML = forecastHTML;
}

function displayWeather(response) {
  let city_name = document.querySelector("#city-name");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let description = document.querySelector("#description");
  let icon_element = document.querySelector("#today-icon");
  celcius_element.style.color = "hotpink";
  fahrenheit_element.style.color = "skyblue";

  city_name.innerHTML = response.data.name;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  description.innerHTML = response.data.weather[0].main;
  icon_element.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
  icon_element.setAttribute("alt", response.data.weather[0].description);
  celcius_temperature = response.data.main.temp;
  displayTemperature(celcius_temperature);
  currentDateTime(response.data.dt);
  getForecast(response.data.coord);
}

// to find temperature of city
function getCityTemperature(city_name) {
  let api_url = `https://api.openweathermap.org/data/2.5/weather?`;
  axios
    .get(`${api_url}q=${city_name}&appid=${api_key}&units=metric`)
    .then(displayWeather);
}

// to find temperature of user current location
function currentLocTemperature(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let api_url = `https://api.openweathermap.org/data/2.5/weather?`;
  axios
    .get(
      `${api_url}lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
    )
    .then(displayWeather);
}

function getCurrentLocation(event) {
  if (event) {
    event.preventDefault();
  }

  navigator.geolocation.getCurrentPosition(currentLocTemperature);
}

//to dispaly current temperature
function displayTemperature(value) {
  let temperature_element = document.querySelector("#current-temperature");
  temperature_element.innerHTML = Math.round(value);
}

function changeToCelcius() {
  fahrenheit_element.style.color = "skyblue";
  return celcius_temperature;
}

function changeToFahrenheit() {
  celcius_element.style.color = "skyblue";
  return celcius_temperature * (9 / 5) + 32;
}

function changeTemperature(event) {
  event.preventDefault();
  let target = event.target;
  if (target.style.color != "hotpink") {
    target.style.color = "hotpink";

    let current_temperature =
      target.id === "celcius" ? changeToCelcius() : changeToFahrenheit();
    displayTemperature(current_temperature);
  }
}

let api_key = "ca0db41e2e878c74a1dfc7ffece370d4";
getCityTemperature("new delhi");
// getCurrentLocation();

// search city
let form = document.querySelector(".search-bar");
form.addEventListener("submit", searchCity);

// calling navigator API to get current location temperature
let locate_button = document.querySelector("#current-location");
locate_button.addEventListener("click", getCurrentLocation);

// change temperature unit
let celcius_temperature = null;
let celcius_element = document.querySelector("#celcius");
celcius_element.addEventListener("click", changeTemperature);

let fahrenheit_element = document.querySelector("#fahrenheit");
fahrenheit_element.addEventListener("click", changeTemperature);
