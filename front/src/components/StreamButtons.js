import React from 'react';
import './StreamButtons.css';

const StreamButtons = ({ streams, onSelectStream, activeStreamKey }) => {
  const streamNames = {
    eclipse: 'Eclipse Stream',
    incept1on: 'Incept1on Stream',
    viox: 'Viox Stream'
  };

  return (
    <div className="buttons-container">
      {Object.keys(streams).map((streamKey) => (
        <button
          key={streamKey}
          className={`stream-button ${activeStreamKey === streamKey ? 'active' : ''}`}
          onClick={() => onSelectStream(streamKey)}
        >
          {streamNames[streamKey]}
        </button>
      ))}
    </div>
  );
};

export default StreamButtons;
