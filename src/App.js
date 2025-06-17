import setting from './asset/setting.png';
import cloudy from './asset/cloudy.png';
import rainy from './asset/rainy-day.png';
import storm from './asset/storm.png';
import clouds from './asset/clouds.png';
import sun from './asset/sun.png';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState("");         // City input
  const [weather, setWeather] = useState(null); // Weather data
  const [error, setError] = useState("");       // Optional: Error message

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9ae2200eb82722de0ffc52f3ea098a71`
      );
      setWeather(response.data); // only store the data part
      setError(""); // clear any previous errors
    } catch (error) {
      setError("City not found or an error occurred.");
      setWeather(null);
    }
  };

  return (
    <div className="App">
      <h1>Weather</h1>

      <button className="setting-btn">
        <img src={setting} alt="Settings" />
      </button>
      <button className="back-btn">&lt;</button>

      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={handleCityChange}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div className="weather-info">
          <h3>{weather.name}</h3>
          <p>Temperature: {(weather.main.temp - 273.15).toFixed(1)} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}

      <div className="days">
        <div>
          <h3><b>Today</b></h3>
          <h6>Jan 15</h6>
          <img src={cloudy} alt="Cloudy" />
        </div>
        <div>
          <h3><b>Wed</b></h3>
          <h6>Jan 16</h6>
          <img src={rainy} alt="Rainy" />
        </div>
        <div>
          <h3><b>Thu</b></h3>
          <h6>Jan 17</h6>
          <img src={storm} alt="Storm" />
        </div>
        <div>
          <h3><b>Fri</b></h3>
          <h6>Jan 18</h6>
          <img src={clouds} alt="Clouds" />
        </div>
        <div>
          <h3><b>Sat</b></h3>
          <h6>Jan 19</h6>
          <img src={sun} alt="Sunny" />
        </div>
      </div>

      <p>Mostly Cloudy with a 40% chance of precipitation</p>
    </div>
  );
}

export default App;
