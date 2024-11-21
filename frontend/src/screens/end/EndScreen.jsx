import React, { useEffect, useRef  , } from 'react';
import './EndScreen.css';
import {  useNavigate } from 'react-router-dom';


const EndScreen = () => {
  const navigate = useNavigate();

 useEffect(() => {
    // Add event listener for popstate which is triggered on back button
    const handlePopState = () => {
      // Redirect to /home when back button is pressed
      console.log('Back button pressed!');
      navigate('/', { replace: true });
      
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener when the component is unmounted
    return () => {
      setTimeout(() => {
        window.removeEventListener('popstate', handlePopState);
      }, 500)
    };
  }, []);

  return (
    <>
    <div className="navbar">
        <div className=" logo">AiPlanet</div>
    </div>
    <div className="home_screen_body">
          Test Ended
        </div>
                
  </>
  )
}

export default EndScreen