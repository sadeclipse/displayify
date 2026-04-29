import React, { useEffect, useRef, useState } from 'react';
import './StreamPlayer.css';

const StreamPlayer = ({ streamUrl, streamType, streamName }) => {
  const videoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!streamUrl) return;

    // Очищаем предыдущее соединение
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }

    setIsConnected(false);
    setError(null);
    setIsLoading(true);

    if (streamType === 'webrtc') {
      startWebRTC();
    } else {
      setError('Unsupported stream type');
      setIsLoading(false);
    }

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [streamUrl, streamType]);

  const startWebRTC = async () => {
    try {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      // Создаем PeerConnection с STUN серверами
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = pc;

      // Обработка входящих треков
      pc.ontrack = (event) => {
        if (videoElement.srcObject !== event.streams[0]) {
          videoElement.srcObject = event.streams[0];
          setIsConnected(true);
          setIsLoading(false);
          setError(null);
        }
      };

      // Обработка ошибок ICE
      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          setError('ICE connection failed');
          setIsConnected(false);
          setIsLoading(false);
        } else if (pc.iceConnectionState === 'connected') {
          console.log('WebRTC connected');
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed') {
          setError('Connection failed');
          setIsConnected(false);
          setIsLoading(false);
        }
      };

      // Собираем ICE кандидаты и отправляем offer
      const offer = await pc.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      });
      
      await pc.setLocalDescription(offer);

      // Добавляем небольшой таймаут для сбора ICE кандидатов
      setTimeout(async () => {
        if (!peerConnectionRef.current) return;

        // Отправляем offer на сервер
        try {
          const response = await fetch(`${streamUrl}/offer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/sdp',
            },
            body: peerConnectionRef.current.localDescription.sdp
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const answerSDP = await response.text();
          
          await peerConnectionRef.current.setRemoteDescription({
            type: 'answer',
            sdp: answerSDP
          });
        } catch (err) {
          console.error('Offer/Answer error:', err);
          setError('Failed to establish connection with server');
          setIsLoading(false);
        }
      }, 500);

    } catch (err) {
      console.error('WebRTC error:', err);
      setError(`WebRTC error: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="player-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Connecting to stream...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="stream-video"
        autoPlay
        playsInline
        muted={false}
        controls
      />
      
      <div className="stream-status">
        {isConnected && (
          <span className="status-badge connected">
            🔴 LIVE
          </span>
        )}
      </div>
    </div>
  );
};

export default StreamPlayer;
