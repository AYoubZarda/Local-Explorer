import { useState, useEffect } from "react";
import { Cloud, MapPin, Navigation, ThermometerSun, Wind, Droplets, Eye, Compass, Activity, RefreshCw } from "lucide-react";
import axios from "axios";
import './App.css';

function App() {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [displayedActivity, setDisplayedActivity] = useState("");
  const [usedActivities, setUsedActivities] = useState(new Set());
  const [activityPrompte, setActivityPrompte] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchWeather(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    const apiUrl = import.meta.env.VITE_WEATHER_API_URL;
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    console.log(apiUrl, apiKey);

    try {
      const response = await axios.get( `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);

      const data = response.data;
      if (response.status === 200) {
        setWeather(data);
        setError(null);
        generateActivities(data);
      } else {
        setError(data.message);
        setWeather(null);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch weather data");
      setWeather(null);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_WEATHER_API_URL;
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    try {
      if (!location) {
        setError("Location is required");
        return;
      }
      const response = await axios.get( `${apiUrl}?q=${location}&appid=${apiKey}&units=metric` );
      const data = response.data;
      if (response.status === 200) {
        setWeather(data);
        setError(null);
        generateActivities(data);
      } else {
        setError(data.message);
        setWeather(null);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch weather data");
      setWeather(null);
    }
  };

  const generateActivities = async (weatherData) => {
    const apiUrl = import.meta.env.VITE_ACTIVITY_API_URL;
    const apiKey = import.meta.env.VITE_ACTIVITY_API_KEY;

    const prompt = `Based on the following location and weather conditions, suggest a list of the best activities to do today. The location is ${weatherData.name} (latitude: ${weatherData.coord.lat}, longitude: ${weatherData.coord.lon}). The current weather is ${weatherData.weather[0].description} with a temperature of ${weatherData.main.temp}°C, humidity of ${weatherData.main.humidity}%, and wind speed of ${weatherData.wind.speed} m/s. The visibility is ${weatherData.visibility} meters. Please recommend activities that are suitable for this weather and location, including outdoor, cultural, and leisure options.`;

    try {
      const response = await axios.post(
        `${apiUrl}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        const newActivities = data.candidates[0].content.parts[0].text
          .split("\n")
          .filter((activity) => activity.trim() !== "");
        setActivityPrompte(newActivities[0]);
        setActivities((prev) => [...prev, ...newActivities]);
        setError(null);
        showNextActivity();
      } else {
        setError("Failed to generate activities");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to generate activities");
    }
  };


  const showNextActivity = () => {
    const unusedActivities = activities.filter(
      (activity) => !usedActivities.has(activity)
    );

    if (unusedActivities.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedActivities.length);
      const nextActivity = unusedActivities[randomIndex];
      setDisplayedActivity(nextActivity);
      setUsedActivities((prev) => new Set([...prev, nextActivity]));
    } else {
      setDisplayedActivity("No more unique activities. Refresh for more!");
    }
  };

  const handleRefresh = () => {
    if (weather) {
      generateActivities(weather);
    }
  };

  const getMapUrl = () => {
    if (!weather) return '';
    const location = `${weather.name},${weather.sys.country || ''}`;
    // return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    return`https://maps.google.com/maps?q=${position.latitude},${position.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="header">
          <h1>Local Explorer</h1>
          <p>Discover perfect activities for your weather</p>
        </div>

        {!position.latitude && !position.longitude && (
          <div className="location-form">
            <form onSubmit={handleLocationSubmit}>
              <div className="input-container">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                />
              </div>
              <button type="submit" className="submit-button">
                <MapPin className="icon" />
                Find
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {weather && (
          <>
            <div className="weather-activity-grid">
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
              </div>

              <div className="card activity-card">
                <h2>
                  <Activity className="icon green" />
                  Activity Suggestions
                </h2>
                <div className="activity-content">
                  {activityPrompte && (
                    <p className="activity-prompt">{activityPrompte}</p>
                  )}
                  {displayedActivity ? (
                    <p className="activity-text">{displayedActivity}</p>
                  ) : (
                    <p className="no-activity">No activities generated yet.</p>
                  )}
                </div>
                <div className="button-group">
                  <button onClick={showNextActivity} className="button green">
                    <Activity className="icon" />
                    Next Activity
                  </button>
                  <button onClick={handleRefresh} className="button blue">
                    <RefreshCw className="icon" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="card map-container">
              <iframe
                src={getMapUrl()}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
