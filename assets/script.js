//global variables
var searchHist= [];
var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall`;
var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather`;
var lat = "";
var lon = "";

//DOM Element 
var searchForm = document.querySelector("#searchForm");
var searchText = document.querySelector("#searchText");
var mainWeather = document.querySelector(".weatherContainer");
var futureForcast = document.querySelector(".futureForecast");
var weatherCards = document.querySelector(".mainWeatherCards");

const apiKey = "b256ae4b79d834242cabefb17b1c0012";

//function to search

//function to display city name

//function to displayed current weather data
function getCurrentWeather(city, weather, timezone) {
    fetch(`${currentWeatherApi}q={city name},{state code},{country code}&appid=${apiKey}`)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (data){
        console.log(data)
    })
}

