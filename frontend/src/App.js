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
// import Camera3 from "./screens/camera3/Camera3";
import Login from "./screens/login/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import TestResult from "./screens/testresults/TestResult";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import DetailedResult from "./screens/detailedResult/DetailedResult";
import CameraCapture from "../src/components/camera-capture/camera-capture";
import Recording from "./components/recordings/Recording";
import QuestionForm from "./screens/questionform/QuestionForm";
import Subjective from "./components/subjective/Subjective";
import SpeechSuper from "./screens/super-speech/super-speech";
import SpeechAce from "./screens/speechAce/SpeechAce";

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
        {/* <Route path="/camera3/:cid" element={<Camera3 />} /> */}
        <Route path="/login-dashboard" element={<Login />} />
        <Route path="/dashboard/:hrId" element={<Dashboard />} />
        <Route path="/:hrid/:test" element={<TestResult />} />
        <Route path="/:candidateNo" element={<DetailedResult />} />
        <Route path="/capture" element={<CameraCapture />}  />
        <Route path="/recording" element={<Recording />} />
        <Route path="/add-question" element={<QuestionForm />} />
        <Route path="/subjective" element={<Subjective />} />
        <Route path="/speech-super" element={<SpeechSuper /> } />
        <Route path="/speech-ace" element={<SpeechAce /> } />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
