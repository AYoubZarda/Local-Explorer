import React from 'react';
import { MapPin } from 'lucide-react';
import './LocationForm.css';

const LocationForm = ({ location, setLocation, handleLocationSubmit }) => {
  return (
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
  );
};

export default LocationForm;
