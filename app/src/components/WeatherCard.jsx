import React from 'react';
import { Cloud, Compass, Droplets, Eye, ThermometerSun, Wind } from 'lucide-react';
import './WeatherCard.css';













import { useState, useEffect } from 'react';


const DigitalClock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="clock-container">
      <div className="clock-box">
        <div className="date">
          {formatDate(date)}
        </div>
        <div className="time">
          {formatTime(date)}
        </div>
      </div>
    </div>
  );
};






const WeatherCard = ({ weather }) => {
  return (
    <div className="card weather-card">
      <h2>
        <Cloud className="icon blue" />
        Current Weather
      </h2>
      <div className="weather-grid">
        <div className="weather-item">
          <ThermometerSun className="icon orange" />
          <div>
            <p className="label">Temperature</p>
            <p className="value">{weather.main.temp}°C</p>
          </div>
        </div>
        <div className="weather-item">
          <Cloud className="icon blue" />
          <div>
            <p className="label">Weather</p>
            <p className="value">{weather.weather[0].description}</p>
          </div>
        </div>
        <div className="weather-item">
          <Wind className="icon light-blue" />
          <div>
            <p className="label">Wind Speed</p>
            <p className="value">{weather.wind.speed} m/s</p>
          </div>
        </div>
        <div className="weather-item">
          <Droplets className="icon light-blue" />
          <div>
            <p className="label">Humidity</p>
            <p className="value">{weather.main.humidity}%</p>
          </div>
        </div>
        <div className="weather-item">
          <Eye className="icon gray" />
          <div>
            <p className="label">Visibility</p>
            <p className="value">{weather.visibility}m</p>
          </div>
        </div>
        <div className="weather-item">
          <Compass className="icon gray" />
          <div>
            <p className="label">Location</p>
            <p className="value">{weather.name}</p>
          </div>


        </div>
      </div>
          <DigitalClock />
    </div>
  );
};

export default WeatherCard;
