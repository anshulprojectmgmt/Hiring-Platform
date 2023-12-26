import React from "react";
import "./Angle.css";
import keyboard from "../../assests/keyboard.jpg";
import lap from "../../assests/lap.jpg";
import left from "../../assests/leftjpg.jpg";
import right from "../../assests/right.jpg";
import { useDispatch } from "react-redux";

const Angle = () => {
  const dispatch = useDispatch();
  const handleNext = () => {
    dispatch({ type: "NEXT" });
  };

  return (
    <div className="angle">
      <div className="angle-head">
        <h3>Anti-Cheating Measure 1 : Second Screen Detection</h3>
        <p>
          Warning: Tests are being monitored using anti cheating AI algorithms. If you are
          caught using second screen, you will be disqualified.
        </p>
      </div>
      <div className="angle-images">
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
            {/* <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button> */}
          </div>
          <div className="carousel-inner mycarousel">
            <div className="carousel-item active ">
              <img src={left}  alt="..."></img>
              <img src={lap}  alt="..."></img>
              
            </div>
            <div className="carousel-item">
            <img src={right}  alt="..."></img>
              <img src={keyboard}  alt="..."></img>
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
      <div className="angle-foot">
        <h4>AI PROCTORING: FACE ANGLE DETECTION AND EYE BALL TRACKING</h4>
        <p>
          Excessive/unusual ammount of <span>glancing outside screen</span> will
          result into flagging of your test and it will be manually reviewed.
        </p>
      </div>
      <div className="angle-navigation">
        {/* <button onClick={handleBack} className="ctabutton">Back</button> */}
        <button onClick={handleNext} className="ctabutton">
          Next
        </button>
      </div>
    </div>
  );
};

export default Angle;
