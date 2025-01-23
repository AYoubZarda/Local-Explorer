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
  const [mapUrl, setMapUrl] = useState("");


const getlocalisation = async () => {

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


const handleLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
      setPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    } ,(error) => {
      getlocalisation();}
    ,);
  }
};

useEffect(() => {
  handleLocation();
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
        setMapUrl(`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`)
        generateActivities(data);
        return true;
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
        setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`)
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

  // const getMapUrl = () => {

  //   if(location !==  "" && position.latitude === null && position.longitude === null)
  //     {
  //       const locatio = `${weather.name},${weather.sys.country || ''}`;
  //       console.log("locatio from input", locatio);
  //       return ;

  //     }
  //   return;
  // };

  return (
    <div className="app-container">
      <div className="content-container">
        <Header />
          <LocationForm
            location={location}
            setLocation={setLocation}
            handleLocationSubmit={handleLocationSubmit}
            handleLocation={handleLocation}
          />
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
            <MapContainer getMapUrl={mapUrl} 
              setMapUrl={setMapUrl} />
          </>
        )}
      </div>
    
      <Footer />


    </div>
  );
};

export default App;


// {!position.latitude && !position.longitude && (
//   <LocationForm
//     location={location}
//     setLocation={setLocation}
//     handleLocationSubmit={handleLocationSubmit}
//   />
// )}