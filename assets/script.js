//global variables
var searchHist= [];
var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall`;
var geoApi = `http://api.openweathermap.org/geo/1.0/direct`;
var lat;
var lon;

//DOM Element 
var searchForm = document.querySelector("#searchForm");
var searchText = document.querySelector("#searchText");
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

        lat = data[0].lat;
        lon = data[0].lon;

        getWeatherInfo(lat, lon)
    })

} 
getLocationWeather("Tra Vinh")

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
            todaysDate.textContent= locationDate;

        //set vars for weather Information
        var weatherIconMain = data.current.weather[0].icon;
        
        var weatherTemp = data.current.temp;
            displayTemp.textContent = `${weatherTemp} °F`;
        var weatherFeels = data.current.feels_like;
            feelsLike.textContent = `Feels Like: ${weatherFeels} °F`;
        // var weatherDescription = data.current.weather[0].description;
        //     description.textContent = weatherDescription;
        // var weatherClouds = data.current.clouds;
        //     clouds.textContent = weatherClouds
        // var weatherVisibility = data.current.visibility;
        //     visibility.textContent = `Visibility: ${weatherVisibility}`;
        var weatherHumid = data.current.humidity;
            humidity.textContent = `Humidity: ${weatherHumid} %`;
        var weatherUV = Math.round(data.current.uvi * 10) / 10;
            UVIndex.textContent = `UV Index: ${weatherUV} %`

    })
}
