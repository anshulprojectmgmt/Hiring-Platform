import React from "react";
import "./Angle2.css";
import keyboard2 from "../../assests/keyboard2.jpg";
import lap from "../../assests/lap.jpg";
import left from "../../assests/leftjpg.jpg";
// import right from "../../assests/right.jpg";
import { useDispatch } from "react-redux";
import QRCode from 'react-qr-code';
import BASE_URL from "../../Api";
import axios from "axios";
import { toast } from "react-toastify";

const Angle = () => {
  const dispatch = useDispatch();
  const cid = localStorage.getItem('cid');

  const handleNext = async () => {
    const res = await axios.post(`${BASE_URL}/api/check-if-cam2-enabled`, {
      cid: cid
    });
   
    if(res.data.cam2status) {
      dispatch({ type: "NEXT" });
    } else {
      toast.warning("You haven't started the second camera yet");
    }

   
  };

  /* const handleNext = () => {
    dispatch({ type: "NEXT" });
  }; */
  const handleBack = () => {
    dispatch({ type: "BACK" });
  };

  return (
    <div className="angle">
      <div className="angle2-head">
        <h3>Face side profile, Keyboard and hands detection</h3>
        <p>
          Steps: In order to ensure that you are really the one taking the test,
           please scan the below QR code from your mobile device and setup your mobile device at an angle at which your face,
            hands and keyboard of the laptop you are attempting the test on can be viewed
        </p>
      </div>
      <div className="angle2-images">
        <div
          id="carouselExampleIndicators"
          className="carousel carousel-dark slide"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
           
          </div>
          <div className="carousel-inner mycarousel">
            <div className="carousel-item active ">
              <div className="d-flex justify-center items-center gap-1">
              <img src={keyboard2}  alt="..."></img>
              {/**https://aiplanet.me/
               window.location.host
               */}
              <QRCode value={'https://aiplanet.me' + "/camera2/" + cid} size={256} />
              </div>
            </div>

            <div className="carousel-item ">
            <div className="d-flex justify-center items-center gap-1">
              <img src={left}  alt="..."></img>
              <img src={lap}  alt="..."></img>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="angle2-foot">
        <h4>AI PROCTORING: Face, hands and keyboard detection</h4>
        <p>
          Our system will flag off any missing video frames which detect that your hands, face or the keyboard of the laptop you are attempting the test on, is not detected
        </p>
      </div>
      <div className="angle2-navigation">
        <button onClick={handleBack} className="ctabutton">Back</button>
        <button onClick={handleNext} className="ctabutton">
          Next
        </button>
      </div>
    </div>
  );
};

export default Angle;
