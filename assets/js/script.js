// global variables
var cityInputEl = document.getElementById('city');
var userFormEl = document.getElementById('city-search');
var searchBtn = document.getElementById('search-btn');
var clearBtn = document.getElementById('clear-btn');
var apiKey = '18a7fc6d811ac42bd255ac1011ced4fd';
var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var newWeatherApiUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat='
var iconUrl = 'https://openweathermap.org/img/w/'
var weatherDisplay = document.getElementById('weather-data');
var dateDisplay = document.getElementById('current-date');
var currentDay = dayjs().format('dddd,  MMMM D, YYYY');
var city = "";
var searchHistory = document.getElementById('search-history');
var cityHistory = [];
var body = document.getElementsByTagName('body');
var savedCityBtn = document.getElementById('search-history');
var cityLat = "";
var cityLon = "";
var fiveDayHeader = document.getElementById('five-day');
var forecastArea = document.getElementById('forecast-container');

// function to display buttons for previously search cities
function displaySearchHistory() {
  cityHistory = JSON.parse(localStorage.getItem("saved-cities")) || [];
  searchHistory.innerHTML ='';

  for (i = 0; i < cityHistory.length; i++) {
      
      var savedCityBtn = document.createElement("button");
      savedCityBtn.classList.add("btn", "btn-primary", "my-2", "saved-city");
      savedCityBtn.setAttribute("style", "width: 100%");
      savedCityBtn.setAttribute('attr', cityHistory[i].city);
      savedCityBtn.textContent = `${cityHistory[i].city}`;
      searchHistory.appendChild(savedCityBtn);
  }
  return;
}

// function to display city name and time
function displayCityTime(city) {
  dateDisplay.append(city + ' - ' + currentDay);
};

// function to get coordinates of searched city from OpenWeatherMap API
function getCoordinates(city) {
  fetch(weatherApiUrl + city +'&appid=' + apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    cityLat = data.coord.lat;
    cityLon = data.coord.lon;
    var cityInfo = {
      city: city
    }

console.log(cityHistory);
cityHistory = JSON.parse(localStorage.getItem("saved-cities")) || [];

    if (cityHistory.includes(city) === false) {
    cityHistory.push(cityInfo);
    localStorage.setItem("saved-cities", JSON.stringify(cityHistory));
    return cityInfo;
    }


})

  .then(function (data) {
  getCurrentWeather(data);
  displaySearchHistory();

})
return;
}


// function to get current and future weather from API
function getCurrentWeather(data) {
  fetch(newWeatherApiUrl + cityLat + '&lon=' + cityLon + '&exclude=minutely,hourly&units=imperial&apiKey=' + apiKey)

  .then(function (response) {
    return response.json();

  })

  .then(function (data) {
    console.log(data);
    var iconCode = data.current.weather[0].icon;
    var h2Break = document.createElement('br');
    var icon1 = document.createElement('img');
    var listItem1 = document.createElement('li');
    var listItem2 = document.createElement('li');
    var listItem3 = document.createElement('li');
    dateDisplay.appendChild(h2Break);
    icon1.setAttribute("src", iconUrl + iconCode + '.png');
    icon1.setAttribute("style", "margin-left: 15px");
    dateDisplay.appendChild(icon1);
    listItem1.textContent = 'Temp: ' + data.current.temp + ' F';
    dateDisplay.appendChild(listItem1);
    listItem2.textContent = 'Wind: ' + data.current.wind_speed + ' MPH';
    dateDisplay.appendChild(listItem2);
    listItem3.textContent = 'Humidity: ' + data.current.humidity + ' %';
    dateDisplay.appendChild(listItem3);
    dateDisplay.setAttribute("style", "border:thin; border-color:black; border-style:solid;");
    forecastArea.setAttribute("style", "visibility:visible");

    for (var i=1; i < 6; i++) {

      var dateElement = forecastArea.querySelector("#card-date" + i);
      var unixDate = data.daily[i].dt;
      dateElement.textContent = dayjs.unix(unixDate).format("MM/DD/YYYY");
      var iconElement = forecastArea.querySelector("#img" + i);
      var forecastIcon = data.daily[i].weather[0].icon;
      iconElement.setAttribute("src", iconUrl + forecastIcon + '.png');
      var tempElement = forecastArea.querySelector("#card-temp" + i);
      var forecastTemp = data.daily[i].temp.max;
      tempElement.textContent = 'Temp: ' + forecastTemp + ' F';
      var windElement = forecastArea.querySelector("#card-wind" + i);
      var forecastWind = data.daily[i].wind_speed;
      windElement.textContent = 'Wind: ' + forecastWind + ' MPH';
      var humidityElement = forecastArea.querySelector("#card-humidity" + i);
      var forecastHumidity = data.daily[i].humidity;
      humidityElement.textContent = 'Humidity: ' + forecastHumidity + ' %';

    };

    // append the 5-day forecast header
    fiveDayHeader.append('5-Day Forecast');
  }
  )}

// event listener for search button
userFormEl.addEventListener("submit", function(event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();
  if(city){
    getCoordinates(city);
    cityInputEl.value = "";
} else{
    alert("Please enter a City");
}

  displayCityTime(city);

// event listener to clear any weather data displayed when new search is performed
searchBtn.addEventListener("click", function clearData() {
  dateDisplay.replaceChildren();
  fiveDayHeader.replaceChildren();
});


});


//clear local storage and clear history buttons
clearBtn.addEventListener("click",function(event) {
  event.preventDefault();
  localStorage.clear();
  searchHistory.replaceChildren();
  cityHistory = [];
});

// event listener for saved city buttons
savedCityBtn.addEventListener("click",function(e) {
  var savedCityButton = document.getElementsByClassName('saved-city');
  cityHistory = JSON.parse(localStorage.getItem("saved-cities")) || [];
  city = e.target.textContent;
  dateDisplay.replaceChildren();
  fiveDayHeader.replaceChildren();
  displayCityTime(city);
  getCoordinates(city);
});

displaySearchHistory();

