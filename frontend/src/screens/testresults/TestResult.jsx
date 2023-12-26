import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./TestResult.css";
import BASE_URL from "../../Api";

const TestResult = () => {
  const location = useLocation();
  const testData = location.state;
  const type = testData.type;
  const code = testData.testcode;
  const proctored = testData.proctored;
  const [candidates, setCandidates] = useState([]);
  const [isProctor, setIsProctor] = useState(false);

  // console.log(proctored)
  // console.log("candidates", candidates.length);

  useEffect(() => {
    const fetchCandidates = async () => {
      const res = await axios.post(`${BASE_URL}/api/get-candidates`, {
        code,
      });
      setCandidates([...res.data]);
    };
    fetchCandidates();
  }, [code]);

  const handleProctor = async () => {
    const res = await axios.post(`${BASE_URL}/api/proctor-handler`, {
      testcode: code,
    });
    // console.log(res.data);
    const ans = await axios.post(`${BASE_URL}/api/sqs-sendmessage`, {message:code});
    
    setIsProctor(true);
  };
  return (
    <>
      <div className="result-screen">
        {/* <div className="logo">AiPlanet</div> */}

        <h1 className="title-heading">{`Test-${testData.key} Results`}</h1>
        <div className="proctoring-btn">
          {candidates.length !== 0 &&
          proctored === "No" &&
          isProctor === false ? (
            <div onClick={handleProctor} className="ctabutton">
              Get Proctoring Result
            </div>
          ) : null}
        </div>

        <div className="result-dashboard">
          <div className="candidate-items ">
            <table className="border-secondary table-hover table table-borderless">
              <thead className="border-secondary">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone No.</th>
                  <th scope="col">TimeTaken</th>
                  <th scope="col">Tab Switch</th>
                  <th scope="col">Que. Solved</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody>
                {candidates !== []
                  ? candidates.map((candidate, i) => {
                      const sum = candidate.result.reduce(
                        (accumulator, curVal) => {
                          return accumulator + curVal.score;
                        },
                        0
                      );
                      return (
                        <tr className="detail-result" key={i}>
                          <td>
                            <Link
                              to={`/candidate-${i + 1}`}
                              state={{ candidateInfo: candidate, sum: sum, type: type }}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </Link>
                          </td>
                          <td>{candidate.name}</td>
                          <td>{candidate.email}</td>
                          <td>{candidate.phonenumber}</td>
                          <td>{Math.floor(candidate.timetaken/60)}m {candidate.timetaken%60}s</td>
                          <td>{candidate.tabswitch}</td>
                          <td>{candidate.result.length}</td>
                          <th>{sum}</th>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestResult;
