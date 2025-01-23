import React from 'react';
import { MapPin } from 'lucide-react';
import './LocationForm.css';



const LocationForm = ({ location, setLocation, handleLocationSubmit, handleLocation, setMapUrl }) => {
  return (
    <div className="location-form">
      <form onSubmit={handleLocationSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Choose Another City ... "
            />
        </div>
        <button type="submit" className="submit-button">
          Find city
        </button>
        <button
          type="button" // Utilisez type="button" pour éviter de soumettre le formulaire
          className="submit-button"
          onClick={handleLocation}
        >
          <MapPin className="icon" />
        </button>
      </form>
    </div>
  );
};

export default LocationForm;

{/* <MapPin className="icon" /> */}