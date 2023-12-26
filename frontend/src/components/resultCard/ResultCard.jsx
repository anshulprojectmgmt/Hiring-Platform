import React from "react";
import "./ResultCard.css";

const ResultCard = (props) => {
  const result = props.report;
  const type = props.type;
  // console.log(type);
  return (
    <>
      {result.map((prob, i) => {
        return (
          <div key={i} className="result-card">
            <div className="question"><b>Question:</b> {prob.question}</div>
            {type === 'mcq' ? <div className="solution"><b>Option Selected:</b> {prob.optionSelected}</div> : <div className="solution"><b>Solution:</b> <pre>{prob.code}</pre></div>}
            <div className="marks"><b>Score:</b> {prob.score}</div>
          </div>
        );
      })}
    </>
  );
};

export default ResultCard;
