import setting from './asset/setting.png';
import clouds from './asset/clouds.png';
import cloudy from './asset/cloudy.png';
import rainy from './asset/rainy-day.png';
import strom from './asset/storm.png';
import sun from './asset/sun.png';

import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

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
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=9ae2200eb82722de0ffc52f3ea098a71`
      );
      setWeather(response.data);
      setForecast(groupWeatherIntoDays(response.data));
      setError("");
    } catch (error) {
      setError("City not found or an error occurred.");
      setWeather(null);
      setForecast([]);
    }
  };

  function groupWeatherIntoDays(data) {
    const forecastByDay = {};

    // Local icon mapping based on weather type
    const iconMap = {
      Clear: sun,
      Clouds: cloudy,
      Rain: rainy,
      Thunderstorm: strom,
      Drizzle: rainy,
      Snow: clouds,
      Mist: clouds,
      Haze: clouds,
      Smoke: clouds,
      Fog: clouds,
    };

    data.list.forEach(entry => {
      const date = new Date(entry.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      const main = entry.weather[0].main;

      if (!forecastByDay[dayKey]) {
        forecastByDay[dayKey] = {
          temps: [],
          mains: [],
          dateLabel: date.toLocaleDateString("en-US", {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })
        };
      }

      forecastByDay[dayKey].temps.push(entry.main.temp);
      forecastByDay[dayKey].mains.push(main);
    });

    return Object.keys(forecastByDay).slice(0, 5).map(key => {
      const day = forecastByDay[key];
      const maxTemp = Math.max(...day.temps);
      const minTemp = Math.min(...day.temps);
      const main = day.mains[0]; // pick first or most frequent
      const icon = iconMap[main] || clouds; // fallback icon

      return {
        date: day.dateLabel,
        max: Math.round(maxTemp - 273.15),
        min: Math.round(minTemp - 273.15),
        icon: icon
      };
    });
  }

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
          <h3>{weather.city.name}, {weather.city.country}</h3>
          <p>{forecast.length > 0 ? `${forecast[0].max}°C / ${forecast[0].min}°C` : ""}</p>
        </div>
      )}

      <div className="days">
        {forecast.map((day, index) => (
          <div key={index}>
            <h3><b>{index === 0 ? "Today" : day.date.split(' ')[0]}</b></h3>
            <h6>{day.date}</h6>
            <img src={day.icon} alt="Weather Icon" />
            <p>{day.max}°C / {day.min}°C</p>
          </div>
        ))}
      </div>

      {forecast.length > 0 && <p>Mostly Cloudy with a 40% chance of precipitation</p>}
    </div>
  );
}

export default App;
