import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Import axios for making API calls
import './CameraCapture.css'; // Import the CSS file

const CameraCapture = ({captured,setCaptured}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const hasCapturedImage = useRef(false);


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          
            captureImage();
          
          
        };
      }
    } catch (error) {
      console.error('Error accessing the camera: ', error);
    }
  }; 
//http://localhost:3000/camera2/6674134466fc280b2db4230a
  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImageUrl(imageDataUrl);
    }
  };
 
  useEffect(() => {
    if(!captured) {
      startCamera();
    }
    
  }, [captured]);

  const handleRetake = () => {
    setCapturedImageUrl(null);
   
    captureImage();
  };

  const handleSave = async () => {
   setCaptured(capturedImageUrl);

    {/* logic to store capture image on DB */}
    // const BASE_URL='http://localhost:5000'
    // const cid =1;
    // if (capturedImageUrl) {
    //   try {
    //   //  await axios.post('/api/upload', { imageUrl: capturedImageUrl });
    //   const res = await axios.post(`${BASE_URL}/api/validate-camera2-session`, { cid , cam2ImgUrl: capturedImageUrl});
    //   localStorage.setItem('capturedImage', capturedImageUrl);
    //     setCapturedImageUrl(null);
    //    setCaptured(true);
    //     hasCapturedImage.current = false;
    //   } catch (error) {
    //     console.error('Error saving the image: ', error);
    //   }
    // }
  };

  return (
    <div className="camera-container">
       <h3 className='mb-0 text-[#1c4b74] text-center underline' >Please Capture clear Image for futher verification</h3>
      {capturedImageUrl ? (
        <div className='mt-0'>
          <p className='text-center'>Captured Image:</p>
          <img src={capturedImageUrl} alt="Captured" className="captured-image" />
          <div className="button-container">
            <button className='rounded-md bg-[#5880F0]' onClick={handleSave}>Yes</button>
            <button className='rounded-md bg-[#5880F0]' onClick={handleRetake}>No</button>
          </div>
        </div>
      ) : (
        <p>Camera access granted. {captured ? 'Image Captured' : 'Capturing image...' }</p>
      )}
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
