import React from "react";
import face from "../../assests/multiface.mp4";

const Face = () => {
  return (
    <>
      <video width="65%" height="auto" autoPlay loop muted playsInline>
        <source
          src={face}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default Face;
