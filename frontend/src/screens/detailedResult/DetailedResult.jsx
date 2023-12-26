import React from "react";
import './DetailedResult.css'
import { useLocation } from "react-router-dom";
import ResultCard from "../../components/resultCard/ResultCard";

const DetailedResult = () => {
    const location = useLocation();
    const candidateInfo = location.state.candidateInfo;
    const score = location.state.sum;
    const name = candidateInfo.name;
    const type = location.state.type;
    // console.log(name)

  return (
    <>
      <div className="detail-result-screen">
        <div className="logo">{name}</div>

        <h1 className="title-heading">{`Total Score ${score}`}</h1>

        <div className="detail-result-dashboard">
            <ResultCard report={candidateInfo.result} type={type} />
        </div>
      </div>
    </>
  );
};

export default DetailedResult;
