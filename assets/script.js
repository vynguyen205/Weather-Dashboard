//global variables
var searchHist= [];
var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall`;
var geoApi = `http://api.openweathermap.org/geo/1.0/direct`;
var lat;
var lon;

//DOM Element 
var searchForm = document.querySelector("#searchForm");
var searchText = document.querySelector("#searchText");
var searchBtn = document.querySelector(".searchBtn");
//DOM Element <BODY>
var weatherContainer = document.querySelector(".weatherContainer");
var CTName = document.querySelector(".cityName");
var todaysDate = document.querySelector(".todayDate");
var weatherIcon = document.querySelector(".weatherIcon");
var description = document.querySelector(".description");
var displayTemp = document.querySelector(".displayTemp");
var feelsLike = document.querySelector(".feelsLike");
var clouds = document.querySelector(".clouds");
var visibility = document.querySelector(".visibility")
var humidity = document.querySelector(".humid");
var UVIndex = document.querySelector(".UVIndex");
var cityHistory = document.querySelector(".searchHistory")
// var  = document.querySelector(".");
// var  = document.querySelector(".");
// var  = document.querySelector(".");
var weatherCards = document.querySelector(".mainWeatherCards");

//Openweather API key
const apiKey = "b256ae4b79d834242cabefb17b1c0012";



//function to displayed current weather data when searched for city, zip or country code
function getLocationWeather(city) {
    
    //fetch api call
    fetch(`${geoApi}?q=${encodeURI(city)}&limit=5&appid=${apiKey}`)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (data){
        console.log(data);
        //grabbing lat and lon from data
        lat = data[0].lat;
        lon = data[0].lon;
        //pasting the grabbed lat and lon to get weather info
        getWeatherInfo(lat, lon)
        //display city name
        CTName.textContent = city.toUpperCase();

    })

} 

getLocationWeather("Irvine")

// one call Fecth
function getWeatherInfo (latitude, longitude){
    fetch(`${oneCallApi}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        console.log(data);

        //get date
        var UTCDate = data.current.dt;
        var locationDate = new Date((UTCDate*1000));
        var formatedDate = locationDate.toLocaleDateString();
            todaysDate.textContent= formatedDate;

        //set vars for weather Information
        var weatherIconMain = data.current.weather[0].icon;
            weatherIcon.src =  `http://openweathermap.org/img/wn/${weatherIconMain}@4x.png`
        var weatherTemp = data.current.temp;
            displayTemp.textContent = `${weatherTemp} °F`;
        var weatherFeels = data.current.feels_like;
            feelsLike.textContent = `Feels Like | ${weatherFeels} °F`;
        var weatherDescription = data.current.weather[0].description;
            description.textContent = weatherDescription;
        // var weatherClouds = data.current.clouds;
        //     clouds.textContent = weatherClouds
        // var weatherVisibility = data.current.visibility;
        //     visibility.textContent = `Visibility: ${weatherVisibility}`;
        var weatherHumid = data.current.humidity;
        humidity.textContent = `Hum | ${weatherHumid} %`;
        var weatherUV = Math.round(data.current.uvi * 10) / 10;
        UVIndex.textContent = `UV | ${weatherUV} %`;
        
    })
}

//filter search results and save it 

function searchCity(event) {
    event.preventDefault();
    var searchValue = searchText.value.trim();
    getLocationWeather(searchValue);
    
    //add to localstorage
    var fromLocal = localStorage.getItem("city");
    var parsedValue = JSON.parse(fromLocal);
    /*If value is null (meaning that we've never saved anything to that 
    spot in localStorage before), use an empty array as our array. 
    Otherwise, just stick with the value we've just parsed out.*/
    var array = parsedValue || [];

    //If our parsed/empty array doesn't already have this value in it...then  it
    if (array.indexOf(searchValue) === -1){
        array.push(searchValue);

        //turn the array WITH THE NEW VALUE IN IT into a string to prepare it to be stored in localStorage
        var newValue = JSON.stringify(array);

        localStorage.setItem ("city", newValue);
    }
}

//adding to local storage

// function displayStorage (){
    
//      var displayHistory= JSON.parse(localStorage.getItem("city")) || [];

//      if (displayHistory) {

//      }

    
// }

searchBtn.addEventListener("click", searchCity);