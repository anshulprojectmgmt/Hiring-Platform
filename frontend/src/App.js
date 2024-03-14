import "./App.css";
import CreateTest from "./screens/createtest/CreateTest";
import EndScreen from "./screens/end/EndScreen";
import Home from "./screens/registration/Registration";
import Landing from "./screens/landing/Landing";
import Test from "./screens/test/Test";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Instruction from "./screens/instructions/Instruction";
import Camera2 from "./screens/camera2/Camera2";
import Login from "./screens/login/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import TestResult from "./screens/testresults/TestResult";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import DetailedResult from "./screens/detailedResult/DetailedResult";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateTest />} />
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/testend" element={<EndScreen />} />
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/camera2/:cid" element={<Camera2 />} />
        <Route path="/login-dashboard" element={<Login />} />
        <Route path="/dashboard/:hrId" element={<Dashboard />} />
        <Route path="/:hrid/:test" element={<TestResult />} />
        <Route path="/:candidateNo" element={<DetailedResult />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
