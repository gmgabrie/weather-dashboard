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
var oneCallApiUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=';
var iconUrl = 'https://openweathermap.org/img/w/'
var weatherDisplay = document.getElementById('weather-data');
var dateDisplay = document.getElementById('current-date');
var currentDay = dayjs().format('dddd,  MMMM D, YYYY');
var city = "";
var searchHistory = document.getElementById('search-history');
var cityHistory = [];
var body = document.getElementsByTagName('body');

function displaySearchHistory() {
  cityHistory = JSON.parse(localStorage.getItem("saved-cities")) || [];
  searchHistory.innerHTML ='';

  for (i = 0; i < cityHistory.length; i++) {
      
      var savedCityBtn = document.createElement("button");
      savedCityBtn.classList.add("btn", "btn-primary", "my-2", "saved-city");
      savedCityBtn.setAttribute("style", "width: 100%");
      savedCityBtn.textContent = `${cityHistory[i].city}`;
      searchHistory.appendChild(savedCityBtn);
  }
  return;
}

function displayCityTime(city) {
  dateDisplay.append('  ' + city + '    -    ' + currentDay);
};

function getCurrentWeather(city) {
  fetch(weatherApiUrl + city + '&apiKey=' + apiKey + '&units=imperial')
  .then(function (response) {
    return response.json();


  })
  .then(function (data) {
    console.log(data);
    var iconCode = data.weather[0].icon;
    var iconUrl = 'https://openweathermap.org/img/w/' + iconCode + '.png';
    var h2Break = document.createElement('br');
    var icon1 = document.createElement('img');
    var listItem1 = document.createElement('li');
    var listItem2 = document.createElement('li');
    var listItem3 = document.createElement('li');
    dateDisplay.appendChild(h2Break);
    icon1.setAttribute("src", iconUrl);
    dateDisplay.appendChild(icon1);
    listItem1.textContent = 'Temp: ' + data.main.temp + ' F';
    dateDisplay.appendChild(listItem1);
    listItem2.textContent = 'Wind: ' + data.wind.speed + ' MPH';
    dateDisplay.appendChild(listItem2);
    listItem3.textContent = 'Humidity: ' + data.main.humidity + ' %';
    dateDisplay.appendChild(listItem3);
    dateDisplay.setAttribute("style", "border:thin; border-color:black; border-style:solid;");
  })

  displaySearchHistory();

  };

function saveSearch() {
  localStorage.setItem("saved-cities", JSON.stringify(cityHistory));
};

userFormEl.addEventListener("submit", function(event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();
  if(city){
    getCurrentWeather(city);
    // get5Day(city);
    cityHistory.unshift({city});
    cityInputEl.value = "";
} else{
    alert("Please enter a City");
}
saveSearch();
  console.log(city);
  // document.getElementById('city').value = "";
  console.log(currentDay);  
  displayCityTime(city);
  saveSearch();


searchBtn.addEventListener("click", function clearData() {
  dateDisplay.replaceChildren();
});


});


//clear local storage and clear history buttons
clearBtn.addEventListener("click",function(event) {
  event.preventDefault();
  localStorage.clear();
  searchHistory.replaceChildren();
});

displaySearchHistory();

