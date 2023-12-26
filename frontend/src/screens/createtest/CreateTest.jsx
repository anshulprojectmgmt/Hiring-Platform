import React, { useRef, useState } from "react";
import "./CreateTest.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import BASE_URL from "../../Api";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CreateTest = () => {
  const codeRef = useRef(null);
  const [testData, setTestData] = useState({
    name: "",
    email: "",
    password: "",
    type: "",
    language: "",
    difficulty: "",
    questions: "",
    duration: "",
  });
  const [testCode, setTestCode] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");
  const Notification = (data) => {
    if (!data.success) {
      console.log(data.error);
      toast.error("something went wrong");
    } else {
      toast.success("Test is created succesfully!");
      setTestData({
        name: "",
        email: "",
        password: "",
        type: "",
        language: "",
        difficulty: "",
        questions: "",
        duration: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${BASE_URL}/api/create-test`, {
      ...testData,
    });
    setTestCode(response.data.testcode);
    // console.log(response.data);
    Notification(response.data);
  };

  const handleCopy = () => {
    setCopyStatus("Copied");
    const code = codeRef.current.select();
    document.execCommand("copy");
  };

  const handleChange = (e) => {
    setTestData({ ...testData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="client-create">
        <div className="logo">AiPlanet</div>
        <div className="create-form">
          <h1 className="title-heading">Create a test</h1>
          <form onSubmit={handleSubmit} className="input-fields">
            <input
              type="text"
              placeholder="Name"
              name="name"
              required
              value={testData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email ID"
              name="email"
              required
              value={testData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              minLength={7}
              name="password"
              required
              value={testData.password}
              onChange={handleChange}
            />
            <select
              required
              name="type"
              value={testData.Type}
              onChange={handleChange}
            >
              <option value="" disabled selected>
                Select Test Type
              </option>
              <option value="coding">Coding</option>
              <option value="mcq">MCQ</option>
            </select>
            <select
              required
              name="language"
              value={testData.language}
              onChange={handleChange}
            >
              <option value="" disabled selected>
                Select Language
              </option>
              <option value="Python">Python</option>
              {/* <option value="SQL">SQL</option> */}
            </select>
            <select
              required
              name="difficulty"
              value={testData.difficulty}
              onChange={handleChange}
            >
              <option value="" disabled selected>
                Difficulty level
              </option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              required
              name="questions"
              value={testData.questions}
              onChange={handleChange}
            >
              <option value="" disabled selected>
                Number of Questions
              </option>
              {Array.from(Array(10), (e, i) => {
                return (
                  <option value={i + 1} key={i + 1}>
                    {i + 1}
                  </option>
                );
              })}
            </select>
            <input
              min={1}
              type="number"
              placeholder="Duration (in minutes)"
              name="duration"
              required
              value={testData.duration}
              onChange={handleChange}
            />
            <button type="submit" className="ctabutton">
              Create test
            </button>
          </form>
        </div>
        {testCode !== "" ? (
          <div className="testCode">
            <Link to={"/home"} state={{ testcode: testCode }}>
              <button className="ctabutton">preview</button>
            </Link>

            <input
              ref={codeRef}
              readOnly
              type="text"
              value={testCode}
              placeholder={testCode}
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="You can also get your testcodes by login to dashboard"
            />
            <h6
              onClick={handleCopy}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="You can also get your testcodes by login to dashboard"
            >
              <Link>{copyStatus}</Link>
            </h6>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CreateTest;
