import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import './ActivityCard.css';


const ActivityCard = ({ activityPrompte, displayedActivity, showNextActivity, handleRefresh }) => {
  return (
    <div className="card activity-card">
      <h2>
        <Activity className="icon green" />
        Activity Suggestions
      </h2>
      <div className="activity-content">
        {activityPrompte && (
          <p className="activity-prompt">{activityPrompte}</p>
        )}
        
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
