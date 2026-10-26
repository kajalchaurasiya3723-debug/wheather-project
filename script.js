async function getWeather() {

    let city = document.getElementById("city").value.trim();

    let message = document.getElementById("message");

    let result = document.getElementById("result");

    if (city === "") {
        message.innerText = "Please enter city name";
        result.style.display = "none";
        return;
    }

    message.innerText = "Loading...";
    result.style.display = "none";

    try {

        // City ki location pata karna

        let locationUrl =
            "https://geocoding-api.open-meteo.com/v1/search?name="
            + encodeURIComponent(city)
            + "&count=1";

        let locationResponse = await fetch(locationUrl);

        if (!locationResponse.ok) {
            throw new Error("Location service unavailable");
        }

        let locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            message.innerText = "City not found!";
            return;
        }

        let place = locationData.results[0];

        let latitude = place.latitude;
        let longitude = place.longitude;

        // Weather ki information lena

        let weatherUrl =
            "https://api.open-meteo.com/v1/forecast"
            + "?latitude=" + latitude
            + "&longitude=" + longitude
            + "&current=temperature_2m,relative_humidity_2m,"
            + "wind_speed_10m,weather_code";

        let response = await fetch(weatherUrl);

        if (!response.ok) {
            throw new Error("Weather service unavailable");
        }

        let data = await response.json();

        let weather = data.current;

        document.getElementById("cityName").innerText =
            place.name + ", " + place.country;

        document.getElementById("temperature").innerText =
            weather.temperature_2m + "°C";

        document.getElementById("humidity").innerText =
            "💧 Humidity: " + weather.relative_humidity_2m + "%";

        document.getElementById("wind").innerText =
            "💨 Wind Speed: " + weather.wind_speed_10m + " km/h";

        let code = weather.weather_code;

        let condition = "Unknown Weather";

        if (code === 0) {
            condition = "☀️ Clear Sky";
        }
        else if (code >= 1 && code <= 3) {
            condition = "⛅ Cloudy";
        }
        else if (code === 45 || code === 48) {
            condition = "🌫️ Foggy";
        }
        else if (code >= 51 && code <= 67) {
            condition = "🌧️ Rainy";
        }
        else if (code >= 71 && code <= 77) {
            condition = "❄️ Snowy";
        }
        else if (code >= 80 && code <= 82) {
            condition = "🌦️ Rain Showers";
        }
        else if (code >= 95) {
            condition = "⛈️ Thunderstorm";
        }

        document.getElementById("condition").innerText =
            condition;

        result.style.display = "block";

        message.innerText = "";

    }
    catch (error) {

        message.innerText =
            "Something went wrong. Check your internet connection.";

        console.log(error);
    }
}