import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import './ActivityCard.css';


const Loder = () =>  {
  return (
    <div className="container">
      <div className="cloud front">
        <span className="left-front"></span>
        <span className="right-front"></span>
      </div>
      <span className="sun sunshine"></span>
      <span className="sun"></span>
      <div className="cloud back">
        <span className="left-back"></span>
        <span className="right-back"></span>
      </div>
    </div>
  );
};


const ActivityCard = ({ activityPrompte, displayedActivity, showNextActivity, handleRefresh }) => {
  return (
    <div className="card activity-card">
      <h2>
        <Activity className="icon green" />
        Activity Suggestions
      </h2>
      <div className="activity-content">
        {activityPrompte ? (
          <p className="activity-prompt">{activityPrompte}</p>
        ) : <Loder/> }
        
      <div className="button-group">
        <button onClick={showNextActivity} className="button green">
          <Activity className="icon" />
          Next Activity
        </button>
        <button onClick={handleRefresh} className="button submit-button">
          <RefreshCw className="icon" />
          Refresh
        </button>
      </div>

        <div className='prompte' >
        {displayedActivity ? (
          <p className="activity-text">{displayedActivity}</p>
        ) : (
          <p className="no-activity">No activities generated yet.</p>
        )}
        </div>

      </div>
    </div>
  );
};

export default ActivityCard;
