import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeStream, setActiveStream] = useState('incept1on');

  const streams = {
    eclipse: {
      name: 'Eclipse Stream',
      url: 'https://displayify.ru:8889/live/eclipse_stream'
    },
    incept1on: {
      name: 'Incept1on Stream',
      url: 'https://displayify.ru:8889/live/incept1on_stream'
    },
    viox: {
      name: 'Viox Stream',
      url: 'https://displayify.ru:8889/live/viox_stream'
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Displayify - Video Streaming</h1>
      </header>
      
      <div className="buttons-container">
        {Object.entries(streams).map(([key, stream]) => (
          <button
            key={key}
            className={`stream-button ${activeStream === key ? 'active' : ''}`}
            onClick={() => setActiveStream(key)}
          >
            {stream.name}
          </button>
        ))}
      </div>
      
      <div className="iframe-container">
        <iframe
          src={streams[activeStream].url}
          title={streams[activeStream].name}
          className="stream-iframe"
          allow="camera; microphone; display-capture; autoplay"
        />
      </div>
    </div>
  );
}

export default App;
