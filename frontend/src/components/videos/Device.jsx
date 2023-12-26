import React from "react";
import device from "../../assests/device.mp4";

const Device = () => {
  return (
    <>
      <video width="65%" height="auto" autoPlay loop muted playsInline>
        <source
          src={device}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default Device;
