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
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("past-cities");
    var fivedayEl = document.getElementById("forecase-name");
    var todayweatherEl = document.getElementById("today-weather");
    let savedCities = JSON.parse(localStorage.getItem("search")) || [];
