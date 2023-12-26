import React from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import BASE_URL from "../../Api";
import axios from "axios";
import { useState } from "react";

const Dashboard = () => {
  // const param = useParams();
  // const hrid = param.hrId;
  // const hrname = useSelector((state) => state.dashBoardInfo.hrName);
  // const totaltests = useSelector((state) => state.dashBoardInfo.totalTests);
  // let hrid, hrname, totaltests;
  const [hrname, sethrname] = useState("");
  const [totaltests, settotaltests] = useState([]);
  const [hrid, sethrid] = useState();

  useEffect(() => {
    const getDashboardInfo = async () => {
      const email = localStorage.getItem("email");
      const res = await axios.post(`${BASE_URL}/api/get-dashboard-data`, {
        email,
      });
      // console.log(res);
      sethrname(res.data.hrname);
      settotaltests([...res.data.tests]);
      sethrid(res.data.hrid);
    };
    getDashboardInfo();
  }, []);
  return (
    <>
      <div className="admin-dashboard">
        <div className="logo">AiPlanet</div>

        <h1 className="title-heading">Dashbaord</h1>

        <div className="test-dashboard">
          <h2 className="title-heading">Welcome, {hrname}</h2>

          <div className="test-items">
            <table className="my-table border-secondary table-hover table table-borderless">
              <thead className="border-secondary" >
                <tr className="table-head">
                  <th scope="col">S.No.</th>
                  <th scope="col">Date</th>
                  <th scope="col">Test Code</th>
                  <th scope="col">Type</th>
                  <th scope="col">Duration (min)</th>
                  <th scope="col">Questions</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody className="my-table" >
                {totaltests !== [] ? totaltests.map((test, i) => {
                  return (
                    <tr  key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{test.date.substring(0, 10)}</td>
                      <td>{test.testcode}</td>
                      <td style={{textTransform: 'capitalize'}} >{test.type}</td>
                      <td>{test.duration}</td>
                      <td>{test.questions}</td>
                      <td>
                        <Link
                          state={{ ...test, key: i + 1 }}
                          to={`/${hrid}/test${i + 1}`}
                        >
                          check results
                        </Link>
                      </td>
                    </tr>
                  );
                }) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
