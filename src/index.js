function currentDateTime() {
  let date_str = new Date();
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
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
}

// to find temperature of city
function getCityTemperature(city_name) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?`;
  axios
    .get(`${apiUrl}q=${city_name}&appid=${apiKey}&units=metric`)
    .then(displayWeather);
}

// to find temperature of user current location
function currentLocTemperature(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?`;
  axios
    .get(
      `${apiUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    )
    .then(displayWeather);
}

function getCurrentLocation(event) {
  if (event) {
    event.preventDefault();
  }

  navigator.geolocation.getCurrentPosition(currentLocTemperature);
}

function convertToCelcius(temp) {
  temp = (temp - 32) * (5 / 9);
  return temp;
}

function convertToFahrenheit(temp) {
  temp = temp * (9 / 5) + 32;
  return temp;
}

let apiKey = "ca0db41e2e878c74a1dfc7ffece370d4";
getCityTemperature("new delhi");
getCurrentLocation();
currentDateTime();

// search city
let form = document.querySelector(".search-bar");
form.addEventListener("submit", searchCity);

// calling navigator API to get current location temperature
let currentLocButton = document.querySelector("#current-location");
currentLocButton.addEventListener("click", getCurrentLocation);
