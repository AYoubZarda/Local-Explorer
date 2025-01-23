import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';


import Header        from './components/Header';
import LocationForm  from './components/LocationForm';
import ErrorMessage  from './components/ErrorMessage';
import WeatherCard   from './components/WeatherCard';
import ActivityCard  from './components/ActivityCard';
import MapContainer  from './components/MapContainer';
import Footer        from "./components/Footer";



function App() {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [displayedActivity, setDisplayedActivity] = useState("");
  const [usedActivities, setUsedActivities] = useState(new Set());
  const [activityPrompte, setActivityPrompte] = useState("");


const getlocalisation = async () => {

  console.log("getlocalisation oo ");
  const response = await axios.get('https://ipinfo.io/ip');
  if (response.data) {
      const response2 = await axios.get(`https://get.geojs.io/v1/ip/geo/${response.data}`);
      if (response2.data) {
        setPosition({
          latitude: response2.data.latitude,
          longitude: response2.data.longitude,
        });
        fetchWeather(response2.data.latitude, response2.data.longitude);
      }
      else {
        setError("Failed to fetch localisation data");
      }
  }
  else {
    setError("Failed to fetch localisation data");
  }


}

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("navigator.geolocation ", navigator.geolocation);
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchWeather(position.coords.latitude, position.coords.longitude);
      });
      console.log("position ", position);
      if (position.latitude === null || position.longitude === null) {
        getlocalisation();
      }
    }

  }, []);

  const fetchWeather = async (latitude, longitude) => {
    const apiUrl = import.meta.env.VITE_WEATHER_API_URL;
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiUrl || !apiKey) {
      setError("Weather API URL and key are required");
      return;
    }

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
    if (!apiUrl || !apiKey) {
      setError("Weather API URL and key are required");
      return;
    }

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

    if (!apiUrl || !apiKey) {
      setError("Activity API URL and key are required");
      return;
    }

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
        <Header />
        {!position.latitude && !position.longitude && (
          <LocationForm
            location={location}
            setLocation={setLocation}
            handleLocationSubmit={handleLocationSubmit}
          />
        )}
        {error && <ErrorMessage error={error} />}
        {weather && (
          <>
            <div className="weather-activity-grid">
              <WeatherCard weather={weather} />
              <ActivityCard
                activityPrompte={activityPrompte}
                displayedActivity={displayedActivity}
                showNextActivity={showNextActivity}
                handleRefresh={handleRefresh}
              />
            </div>
            <MapContainer getMapUrl={getMapUrl} />
          </>
        )}
      </div>
    
      <Footer />


    </div>
  );
};

export default App;



      // <footer className="footer">
      //   <div className="footer-content">
      //     <div className="footer-section">
      //       <h3>Weather & Activities</h3>
      //       <p>Your personal weather companion and activity planner. Get real-time weather updates and tailored activity suggestions based on current conditions.</p>
      //     </div>
          
      //     <div className="footer-section">
      //       <h3>Quick Links</h3>
      //       <ul>
      //         <li><a href="#"><Globe className="footer-icon" /> Weather Updates</a></li>
      //         <li><a href="#"><Activity className="footer-icon" /> Activities</a></li>
      //         <li><a href="#"><MapPin className="footer-icon" /> Location Search</a></li>
      //       </ul>
      //     </div>
          
      //     <div className="footer-section">
      //       <h3>Connect With Us</h3>
      //       <div className="social-links">
      //         <a href="https://github.com" target="_blank" rel="noopener noreferrer">
      //           <Github className="footer-icon" />
      //         </a>
      //         <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
      //           <Linkedin className="footer-icon" />
      //         </a>
      //         <a href="mailto:contact@weather-activities.com">
      //           <Mail className="footer-icon" />
      //         </a>
      //       </div>
      //     </div>
      //   </div>
        
      //   <div className="footer-bottom">
      //     <p>&copy; {new Date().getFullYear()} Weather & Activities. All rights reserved.</p>
      //   </div>
      // </footer>