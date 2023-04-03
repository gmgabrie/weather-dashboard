// ** START PSEUDO CODE ** //

// when user searches for a city (clicks search button):
//  - store the user input in a variable
//  - use a fetch api to get the current & future conditions for that city
//  - store that city into local storage
// use the data from fetch to populate in the current-weather container:
//  - name and today's date as M/DD/YYY
//  - temp
//  - wind
//  - humidity
// use the data from fetch to populate in the five-day container:
//  - date
//  - an icon reprsentation of weather conditions
//  - the temp
//  - wind speed
//  - humidity
// use data in local.storage to create a button under the <hr> in search area for city history
//  - when you click the button it displays the current and future conditions for that city

// ** END PSEUDO CODE ** //

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

function displayCityTime(city) {
  dateDisplay.append(city + ' - ' + currentDay);
};

function getCoordinates(city) {
  fetch(weatherApiUrl + city +'&appid=' + apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    cityLat = data.coord.lat;
    cityLon = data.coord.lon;
    console.log(cityLat);
    console.log(cityLon);
    var cityInfo = {
      city: city,
      lat: data.coord.lat,
      lon: data.coord.lon
    }

    cityHistory.push(cityInfo);
    localStorage.setItem("saved-cities", JSON.stringify(cityHistory));
    return cityInfo;


})

  .then(function (data) {
  getCurrentWeather(data);
  displaySearchHistory();

})
return;
}



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
    dateDisplay.appendChild(icon1);
    listItem1.textContent = 'Temp: ' + data.current.temp + ' F';
    dateDisplay.appendChild(listItem1);
    listItem2.textContent = 'Wind: ' + data.current.wind_speed + ' MPH';
    dateDisplay.appendChild(listItem2);
    listItem3.textContent = 'Humidity: ' + data.current.humidity + ' %';
    dateDisplay.appendChild(listItem3);
    dateDisplay.setAttribute("style", "border:thin; border-color:black; border-style:solid;");

    for (var i=1; i < 6; i++) {

      // display the date
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
    }
  })

  

    fiveDayHeader.append('5-Day Forecast');

    

  };

function getForecast(city) {
    fetch(forecastApiUrl + apiKey + '&units=imperial&q=' + city)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (var i=1; i < 6; i++) {

        // display the date
        var dateElement = forecastArea.querySelector("#card-date" + i);
        var unixDate = data.list[i].dt;
        dateElement.textContent = dayjs.unix(unixDate).format("MM/DD/YYYY");
        var iconElement = forecastArea.querySelector("#img" + i);
        var forecastIcon = data.list[i].weather[0].icon;
        iconElement.setAttribute("src", iconUrl + forecastIcon + '.png');
      }
    })
  };


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

savedCityBtn.addEventListener("click",function(e) {
  var savedCityButton = document.getElementsByClassName('saved-city');
  cityHistory = JSON.parse(localStorage.getItem("saved-cities")) || [];
  console.log(cityHistory);
  city = e.target.textContent;
  console.log(city);
  dateDisplay.replaceChildren();
  fiveDayHeader.replaceChildren();
  displayCityTime(city);
  getCoordinates(city);
});

displaySearchHistory();

