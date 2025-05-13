// components/VideoCall.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const VideoCall = () => {
  const search = useLocation().search;
  const appointmentId = new URLSearchParams(search).get('appointmentId');
  const [videoLink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoLink = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/video-call/${appointmentId}`);
        setVideoLink(res.data.link);
      } catch (error) {
        console.error('Failed to fetch video call link');
      } finally {
        setLoading(false);
      }
    };
    fetchVideoLink();
  }, [appointmentId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Video Call for Appointment ID: {appointmentId}</h2>
      {loading ? (
        <p>Loading video call link...</p>
      ) : videoLink ? (
        <div>
          <p>Click the button below to join the video call:</p>
          <a href={videoLink} target="_blank" rel="noopener noreferrer">
            <button style={{ padding: '10px 20px', marginTop: '10px' }}>Join Video Call</button>
          </a>
        </div>
      ) : (
        <p>Failed to generate video call link.</p>
      )}
    </div>
  );
};

export default VideoCall;
