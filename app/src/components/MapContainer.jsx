import React from 'react';
import './MapContainer.css';

const MapContainer = ({ getMapUrl }) => {

  console.log(getMapUrl);

  return (
    <div className="card map-container">
      <iframe
        src={getMapUrl}
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      ></iframe>
    </div>
  );
};

export default MapContainer;