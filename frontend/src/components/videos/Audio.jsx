import React from "react";
import audio from "../../assests/voicedetect.mp4";

const Audio = () => {
  return (
    <>
      <video width="65%" height="auto" autoPlay loop muted playsInline>
        <source
          src={audio}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default Audio;