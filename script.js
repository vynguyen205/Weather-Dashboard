//global variables
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//Openweather API key
const API_KEY = "42ef51f916ff136bded67a0d9e0ee75a";
const GEOAPI = 'http://api.openweathermap.org/geo/1.0/direct';
const CURRENTWEATHER = 'https://api.openweathermap.org/data/2.5/weather';
const DAILYWEATHER = 'https://api.openweathermap.org/data/2.5/forecast/daily';

function getTime () {
    var today = new Date ();
    var timeToday = moment();
    //getHours() -- current hour between 0-23
    var hour = today.getHours();
    var time = timeToday.format("dddd, MMMM Do, h:mm");
    var currentTime = document.querySelector(".currentTime");
    var greeting = document.querySelector(".greeting");
    // conditional statement for am and pm, and greetings
    if (hour < 12){
        currentTime.innerHTML = time + "AM";
        greeting.textContent = "🌞 Good Morning!"
        //current time is 6pm or greater, greet evening
    } else if (hour >= 12 && hour < 18) {
        currentTime.innerHTML = time + "PM";
        greeting.textContent = "☀️ Good Afternoon!"
    } 
    else {
        currentTime.innerHTML = time + "PM";
        greeting.textContent = "😴 Good Evening!"
    }
    
}
getTime();

setInterval(function () {
    getTime();
}, 60000)

//function to displayed current weather data when searched for city, zip or country code
function getLocationWeather(city) {
    //fetch api call
    // var geoApi = `https://api.openweathermap.org/geo/1.0/direct`;
    fetch(`${GEOAPI}?q=${encodeURI(city)}&limit=5&appid=${API_KEY}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        console.log(`GEO-API: `,data);
        //grabbing lat and lon from data
        var lat = data[0].lat;
        var lon = data[0].lon;
        //pasting the grabbed lat and lon to get weather info
        getWeatherInfo(lat, lon);
        getDailyInfo(lat, lon);
        //display city name
        var CTName = document.querySelector(".cityName"); 
        CTName.textContent = "📍 " + city;
    })
    
} 
//default Location
getLocationWeather("Irvine")

// one call Fecth
function getWeatherInfo (latitude, longitude) {
fetch(`${CURRENTWEATHER}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        console.log(`CURRENT WEATHER API: `, data);
        
        //get date
        var UTCDate = data.dt;
        var locationDate = new Date(UTCDate * 1000) // 5/15/22
        var formatedDate = days[locationDate.getDay()]; //sun
        var todaysDate = document.querySelector(".todayDate");
        todaysDate.textContent= formatedDate;
        
        //set vars for weather Information
        var weatherIconMain = data.weather[0].icon;
        var weatherIcon = document.querySelector(".weatherIcon");
        weatherIcon.src =  `http://openweathermap.org/img/wn/${weatherIconMain}@2x.png`
        
        var weatherTemp = data.main.temp;
        var displayTemp = document.querySelector(".displayTemp");
        displayTemp.textContent = `${Math.ceil(weatherTemp)}°`;
        
        var weatherFeels = data.main.feels_like;
        var feelsLike = document.querySelector(".feelsLike");
        feelsLike.textContent = `RealFeel | ${Math.ceil(weatherFeels)}°`;
        
        var weatherDescription = data.weather[0].description;
        var description = document.querySelector(".description");
        description.textContent = weatherDescription;
        
        var weatherHumid = data.main.humidity;
        var humidity = document.querySelector(".humid");
        humidity.textContent = `Hum | ${weatherHumid}%`;
        
        // var weatherUV = Math.round(data.main.uvi * 10) / 10;
        // var UVIndex = document.querySelector(".UVIndex");
        // UVIndex.textContent = `UV | ${weatherUV}%`;
        
        // var weatherSunset = data.current.sunset;
        // var sunsetConvert = moment(weatherSunset * 1000)
        //     sunset.textContent = sunsetConvert;
        
    });
}

//fetch Daily weather
function getDailyInfo (lat, lon) {
fetch(`${DAILYWEATHER}?lat=${lat}&lon=${lon}&cnt=${6}&appid=${API_KEY}`)
.then(function(response) {
    return response.json();
})
.then(function(data){
    console.log(`Daily Forcast: `, data);

    let output = '';
    //loop through daily forecast
    for (var d = 1; d < 7; d++) {
        var dailyDt = data.daily[d].dt;
        var dailyDtConvert = new Date(dailyDt * 1000);
        var dailyDtFormat = days[dailyDtConvert.getDay()];
        var dailyWeather = data.daily[d].temp.max;
        var dailyIcon = data.daily[d].weather[0].icon;
        
        output += /*html*/ `
        <div class="eachCard eachCard-blur">
        <div class="flex">
        <img class="dailyWeatherIcon"  src= "http://openweathermap.org/img/wn/${dailyIcon}@2x.png"alt= "Weather Icon">
        <div class="dailyDt">${dailyDtFormat}</div>
        <div class="dailyTemp">${Math.ceil(dailyWeather)}°</div>
        </div>
        </div>
        `;
    }
    $('#dailyForecast').html(output);
    
    let output2 = '';
    //get daily weather info
    const currentDew = Math.ceil(data.current.dew_point);
    const currentWindSpeed = data.current.wind_speed;
    const currentVisibility = Math.floor(data.current.visibility / 1609); //convert to miles
    const currentClouds = data.current.clouds;

    var snapshot = document.querySelector("#snapshot");

    output2 = /*html*/ `
    <div class="littleCard">
    <div class=outsideContainer>
    <span>💧</span>
    <div class="littleContainer">
    <div>Dew Point</div>
    <div class="bold">${currentDew}°</div>
    </div>
    </div>
    <div class=outsideContainer>
    <span>💨</span>
    <div class="littleContainer">
    <div>Wind Speed</div>
    <div class="bold">${currentWindSpeed} mph</div>
    </div>
    </div>
    <div class=outsideContainer>
    <span>🙈</span>
    <div class="littleContainer">
    <div>Visibility</div>
    <div class="bold">${currentVisibility} mi</div>
    </div>
    </div>
    <div class=outsideContainer>
    <span>☁️</span>
    <div class="littleContainer">
    <div>Clouds</div>
    <div class="bold">${currentClouds}%</div>
    </div>
    </div>
    </div>
    `;
    $(snapshot).html(output2);
});    
}

//filter search results and save it 
function searchCity(event) {
    event.preventDefault();
    var searchText = document.querySelector("#searchText");
    var searchValue = searchText.value.trim();
    getLocationWeather(searchValue);
    
    //add to localstorage
    var fromLocal = localStorage.getItem("city");
    var parsedValue = JSON.parse(fromLocal);
    /*If value is null (meaning that we've never saved anything to that 
    spot in localStorage before), use an empty array as our array. 
    Otherwise, just stick with the value we've just parsed out.*/
    var array = parsedValue || [];
    
    /*If our parsed/empty array doesn't already have this value in it
    put it in the front and pop one off the end if array is too big.*/
    if (array.indexOf(searchValue) === -1){
        array.unshift(searchValue);
        //setting limit in localStorage
        if(array.length > 2) {
            array.pop();
        }
        
        //turn the array WITH THE NEW VALUE IN IT into a string to prepare it to be stored in localStorage
        var newValue = JSON.stringify(array);
        
        localStorage.setItem ("city", newValue);
    }
    displayStorage();
}

//adding to local storage

function removeLocal(targetValue) {
    var removeHistory = JSON.parse(localStorage.getItem('city'));
    
    for (var i = 0; i < removeHistory.length; i++){
        if (removeHistory[i] === targetValue){
            //to remove a value from storage
            removeHistory.splice(i,1);
        };
    }
    localStorage.setItem("city",JSON.stringify(removeHistory))
    
    
}

function displayStorage() {
    var displayHistory = JSON.parse(localStorage.getItem('city'));
    //create html element to append
	let output = '';
	if (displayHistory) {
        for (var i = 0; i < displayHistory.length; i++) {
            output += /*html*/ `
            <div class="searchHistory">           
            <button class="historyBtn" data-hover="⚡️" data-id="${displayHistory[i]}">${displayHistory[i]}</button>
            <button class="removeBtn" data-id="${displayHistory[i]}">⚡️</button>
            </div>
            `;
		}
		$('#displayHist').html(output);
	} else {
        console.log('No History to display');
	}
    //remove from local storage
    $(".removeBtn").on("click",function(){
        var cityRemove=$(this).attr("data-id")
        removeLocal(cityRemove)
        location.reload()
    })
}

displayStorage();

var histBtn = document.getElementsByClassName('historyBtn');
for (var b = 0; b < histBtn.length; b++) {
    histBtn[b].addEventListener('click', function (event) {
        var value = event.target.getAttribute('data-id');
		getLocationWeather(value);
	});
}


var searchBtn = document.querySelector(".searchBtn");
searchBtn.addEventListener("click", searchCity);

