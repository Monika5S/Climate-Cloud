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

function displayWeather(response) {
  celcius_element.style.color = "hotpink";
  fahrenheit_element.style.color = "skyblue";

  celcius_temperature = response.data.main.temp;
  displayTemperature(celcius_temperature);

  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  let icon_element = document.querySelector("#today-icon");
  icon_element.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
  icon_element.setAttribute("alt", response.data.weather[0].description);
  currentDateTime(response.data.dt);
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
getCurrentLocation();

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
