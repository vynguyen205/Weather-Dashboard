//global variables
var searchHist= [];
var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall`;
var geoApi = `http://api.openweathermap.org/geo/1.0/direct`;
var lat;
var lon;
var today = new Date ();
//getHours() -- current hour between 0-23
var hour = today.getHours();
//getMinutes() -- current minutes between 0-59
var minute = today.getMinutes()
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//DOM Element Search
var searchForm = document.querySelector("#searchForm");
var searchText = document.querySelector("#searchText");
var searchBtn = document.querySelector(".searchBtn");
//DOM Element left
var currentTime = document.querySelector(".currentTime")
var dayAndDt = document.querySelector(".dayAndDt");
var greeting = document.querySelector(".greeting");
var eachCard = document.querySelector(".eachCard");
var dailyWeatherIcon = document.querySelector(".dailyWeatherIcon");
var dailyDate = document.querySelector(".dailyDt");
var dailyTemp = document.querySelector(".dailyTemp");
//DOM Element <BODY> right
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

function getTime () {
    var time = (hour - 12) + ":" + minute;
    
    //conditional statement for am and pm, and greetings
    if (time < 12){
        currentTime.innerHTML = time + "AM";
        greeting.textContent = "Good Morning!"

    //current time is 6pm or greater, greet evening
    } else if (time >= 18) {
        greeting.textContent = "Good evening!"
    } else {
        currentTime.innerHTML = time + "PM";
        greeting.textContent = "Good Afternoon!"
    }

}
getTime();

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
//default Location
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
        var locationDate = new Date(UTCDate * 1000)
        var formatedDate = days[locationDate.getDay()];
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
        var weatherHumid = data.current.humidity;
            humidity.textContent = `Hum | ${weatherHumid} %`;
        var weatherUV = Math.round(data.current.uvi * 10) / 10;
            UVIndex.textContent = `UV | ${weatherUV} %`;

        //loop through daily forecast
        for (var d = 0; d < 8; d++){

            var dailyDt = data.daily[d].dt;
            var dailyDtConvert = new Date(dailyDt * 1000);
            var dailyDtFormat = days[dailyDtConvert.getDay()];

            var dailyWeather = data.daily[d].temp.max;

            var dailyIcon = data.daily[d].weather[0].icon;

            let output = /*html*/ `
                <div class="eachCard">
                    <img class="dailyWeatherIcon"  src= "http://openweathermap.org/img/wn/${dailyIcon}@2x.png"alt= "Weather Icon">
                    <div class="dailyDt">${dailyDtFormat}</div>
                    <div class="dailyTemp">${dailyWeather} °F</div>
                </div>
            `;
            $('#dailyForecast').html(output);
        }       

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

function displayStorage (){
    
     var displayHistory= JSON.parse(localStorage.getItem("city")) || [];

     if (displayHistory) {

     }

    
}

searchBtn.addEventListener("click", searchCity);