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
var searchBtn = document.getElementById('search-btn');
var apiKey = '18a7fc6d811ac42bd255ac1011ced4fd';
var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var oneCallApiUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=';
var weatherDisplay = document.getElementById('weather-data');
var dateDisplay = document.getElementById('current-date');
var currentDay = dayjs().format('dddd,  MMMM D, YYYY');
var city = "";


function displayCityTime() {
  dateDisplay.append('  ' + city + '    -    ' + currentDay);
};

function getCurrentWeather() {
  fetch(weatherApiUrl + city + '&apiKey=' + apiKey + '&units=imperial')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var listItem1 = document.createElement('li');
    var listItem2 = document.createElement('li');
    var listItem3 = document.createElement('li');
    listItem1.textContent = 'Temp: ' + data.main.temp + ' F';
    dateDisplay.appendChild(listItem1);
    listItem2.textContent = 'Wind: ' + data.wind.speed + ' MPH';
    dateDisplay.appendChild(listItem2);
    listItem3.textContent = 'Humidity: ' + data.main.humidity + ' %';
    dateDisplay.appendChild(listItem3);
    dateDisplay.setAttribute("style", "border:thin; border-color:black; border-style:solid;");
  })
  };


searchBtn.addEventListener("click", function(event) {
  event.preventDefault();

  city = cityInputEl.value;
  console.log(city);
  document.getElementById('city').value = "";
  console.log(currentDay);  
  displayCityTime();
  getCurrentWeather();

});