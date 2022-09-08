function initPage() {
    // apiKey
    const APIKey = "e899e8dcbd6812d3c2b200341f41d25a";

    const cityEl = document.getElementById("city");
    const searchEl = document.getElementById("search-button");
    const nameEl = document.getElementById("city-input");
    const currentPicEl = document.getElementById("weather-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-rays");
    const pastCitieseEl = document.getElementById("past-cities");

    var fivedayEl = document.getElementById("forecast-name");
    var todayweatherEl = document.getElementById("today-weather");
    let savedCities = JSON.parse(localStorage.getItem("search")) || [];


    function getWeather(cityName) {
        // Weather get request
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {
                todayweatherEl.classList.remove("d-none");

                // Parse response to current weather
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.setAttribute("alt", response.data.weather[0].description);
                currentTempEl.innerHTML = "Temperature  " + k2f(response.data.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity  " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed   " + response.data.wind.speed + "  MPH";
                
                // UV Index
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let QueryURLUV = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(QueryURLUV)
                    .then(function (response) { 
                        let UVRays = document.createElement("span");
                        if (response.data[0].value < 4 ) {
                            UVRays.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            UVRays.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVRays.setAttribute("class", "badge badge-danger");
                        }
                        UVRays.innerHTML = response.data[0].value;
                        currentUVEl.innerHTML = "UV Index  ";
                        currentUVEl.append(UVRays);
                    });
                
                // Get 5 day forecast for this city
                let cityInput = response.data.id;
                let QueryURLForecast = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityInput + "&appid=" + APIKey;
                axios.get(QueryURLForecast)
                    .then(function (response) {
                        fivedayEl.classList.remove("d-none");
                        
                        //  Parse response to display forecast for next 5 days
                        const forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);

                            // Icon for current weather
                            const forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastWeatherEl);
                            const forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);
                            const forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
            });
    }

    // Get history from local storage
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        getWeather(searchTerm);
        savedCities.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(savedCities));
        priorSearches();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function priorSearches() {
        pastCitieseEl.innerHTML = "";
        for (let i = 0; i < savedCities.length; i++) {
            const pastCityWeather = document.createElement("input");
            pastCityWeather.setAttribute("type", "text");
            pastCityWeather.setAttribute("readonly", true);
            pastCityWeather.setAttribute("class", "form-control d-block bg-white");
            pastCityWeather.setAttribute("value", savedCities[i]);
            pastCityWeather.addEventListener("click", function () {
                getWeather(pastCityWeather.value);
            })
            pastCitieseEl.append(pastCityWeather);
        } 
    }

    priorSearches();
    if (savedCities.length > 0) {
        getWeather(savedCities[savedCities.length - 1]);
    }
    
}

initPage();