import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ error }) => {
  return (
    <div className="error-message">
      <p>{error}</p>
    </div>
  );
};

export default ErrorMessage;
