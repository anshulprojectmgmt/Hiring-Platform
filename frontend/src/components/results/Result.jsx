import React from "react";
import "./Result.css";

const Result = ({ioRef, editable}) => {
  return (
    <div
      ref={ioRef}
      // placeholder=""
      className="result_area"
      contentEditable={editable}
    ></div>
  );
};

export default Result;