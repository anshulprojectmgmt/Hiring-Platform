import React from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

const ScreenRecorder = () => {
  // Using the useReactMediaRecorder hook to manage screen recording
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ screen: true, audio: false });

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Screen Recorder</h2>
      {/* Display current recording status */}
      <p>Status: {status}</p>
      {/* Button to start recording */}
      <button onClick={startRecording}>Start Recording</button>
      {/* Button to stop recording */}
      <button onClick={stopRecording} style={{ marginLeft: '10px' }}>
        Stop Recording
      </button>

      {/* Show preview of the recorded screen if available */}
      {mediaBlobUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Recording Preview</h3>
          <video src={mediaBlobUrl} controls autoPlay loop style={{ width: '80%' }} />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
