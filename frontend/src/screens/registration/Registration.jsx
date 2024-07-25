import React from "react";
import "./Registration.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from '../../Api';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const code = location.state;
  // console.log('location object==' , location);
  // console.log(code);

  const initialTestCodeValue = code !== null ? code.testcode : "";
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    testcode: initialTestCodeValue,
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const Notification = (data) => {
    if (!data.success) {
      // console.log(data.message);
      toast.error(data.message);
    } else {
      console.log(data);
      localStorage.setItem('cid', data.cid);
      dispatch({
        type: "TEST_INFO",
        testtype: data.info.tests[0].type,
        language: data.info.tests[0].language,
        difficulty: data.info.tests[0].difficulty,
        questions: data.info.tests[0].questions,
        duration: data.info.tests[0].duration,
        testcode: data.info.tests[0].testcode,
        candidateemail: data.candidateEmail,
      });
      toast.success("Registered succesfully!");
      setUserData({
        name: "",
        email: "",
        phonenumber: "",
        testcode: "",
      });
      navigate('/instruction');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${BASE_URL}/api/start-test`, {
      ...userData,
    });
    // console.log(response.data);
    Notification(response.data);
  };

  return (
    <>
      <div className="user-register">
        <div className="logo">AiPlanet</div>
        <div className="register-form">
          <h1 className="title-heading">Register & Start Test</h1>
          <form onSubmit={handleSubmit} className="input-fields">
            <input
              type="text"
              placeholder="Name"
              name="name"
              required
              value={userData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email ID"
              name="email"
              required
              value={userData.email}
              onChange={handleChange}
            />
            <input
            minLength="10"
            maxLength="10"
              type="number"
              placeholder="Phone Number"
              name="phonenumber"
              required
              value={userData.phonenumber}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Test Code"
              name="testcode"
              required
              value={code !== null ? code.testcode : userData.testcode}
              onChange={handleChange}
            />
            <button className="ctabutton" type="submit">
              Register & Start Test
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
