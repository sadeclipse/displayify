import React, { useState } from 'react';
import StreamPlayer from './components/StreamPlayer';
import StreamButtons from './components/StreamButtons';
import './App.css';

function App() {
  const [activeStream, setActiveStream] = useState(null);

  const streams = {
    eclipse: {
      name: 'Eclipse Stream',
      url: 'https://displayify.ru:8889/live/eclipse_stream',
      type: 'webrtc'
    },
    incept1on: {
      name: 'Incept1on Stream',
      url: 'https://displayify.ru:8889/live/incept1on_stream',
      type: 'webrtc'
    },
    viox: {
      name: 'Viox Stream',
      url: 'https://displayify.ru:8889/live/viox_stream',
      type: 'webrtc'
    }
  };

  const handleStreamSelect = (streamKey) => {
    setActiveStream(streams[streamKey]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Displayify - Video Streaming</h1>
      </header>
      
      <StreamButtons 
        streams={streams} 
        onSelectStream={handleStreamSelect}
        activeStreamKey={activeStream ? Object.keys(streams).find(key => streams[key] === activeStream) : null}
      />
      
      {activeStream && (
        <div className="stream-container">
          <h2>{activeStream.name}</h2>
          <StreamPlayer 
            streamUrl={activeStream.url} 
            streamType={activeStream.type}
            streamName={activeStream.name}
          />
        </div>
      )}
    </div>
  );
}

export default App;
