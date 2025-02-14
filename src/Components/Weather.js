import axios from "axios";
import React, { useEffect, useState } from "react";
import style from './Weather.module.css';
import { useLocation } from "react-router";

const WEATHER_API_KEY = 'c96b6f985ca41b7f22af3ba73d70315d';
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const Weather = () => {
  const location = useLocation();
  const country = location.state?.country; 
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(WEATHER_API_URL, {
          params: {
            q: country,
            appid: WEATHER_API_KEY,
            units: "metric",
          },
        });
        setWeather(response.data);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Weather data is unavailable because this country does not have a capital.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className={style["loading"]}>Loading...</div>;
  if (error) return <div className={style["error"]}>{error}</div>;
  if (!weather) return null;

  return (
    <div className={style["weather-container"]}>
      <h1 className={style["title"]}>🌤️ Weather App</h1>
      <div className={style["weather-card"]}>
        <h2>{weather?.name}, {weather?.sys?.country}</h2>
        <p>{weather?.weather?.[0]?.description}</p>
        {weather?.weather?.[0]?.icon && (
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            className={style["weather-icon"]}
          />
        )}

        <div className={style["weather-details"]}>
          <p>🌡️ {weather?.main?.temp}°C</p>
          <p>💨 {weather?.wind?.speed} m/s</p>
          <p>💧 {weather?.main?.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
