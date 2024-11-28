import React, { useState } from "react";
import './UserFeedback.css'
import { useSelector } from "react-redux";
import BASE_URL from "../../Api";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

import runBtn from "../../assests/runBtn.png"
import submitBtn from "../../assests/submitBtn.png"
import permission from "../../assests/permission.jpg"
import faceAuth from "../../assests/face_auth.png"
import rtnOut from "../../assests/return_msg.png"
import inpOutBox from "../../assests/inp-out-box.png"

const UserFeedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    facedIssues: "",
    issuesDetails: "",
    antiCheating: {
      instructionsClear: "",
      deterrentMeasures: "",
      cheatingPrevention: "",
    },
    faceAuth: {
      setupEasyFace: "",
      setupFaceIssue:""
    },
    mediaSharing: {
      setupEasyMedia: "",
      setupMediaIssue:"",
    },
    platformUsage: {
      runButtonConfusion: "",
      runButtonIssue: "",
      submitButtonPurpose: "",
      submitButtonIssue:"",
      inputOutputClear: "",
      inputOutputIssue: "",
      returnInstructionClear: "",
      returnInstructionIssue: "",
    },
  });
  const testInfo = useSelector((state) => state.testInfo);

  const handleInputChange = (field, value, category = null) => {
    if (category) {
      setFeedback((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      }));
    } else {
      setFeedback((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("User Feedback:", feedback);
    // Send `feedback` to backend API here
    try {
      await  axios.post(`${BASE_URL}/api/user-feedback`, {
        email: testInfo.candidateEmail,
        testCode: testInfo.testCode,
        userFeedback: feedback
      })
      navigate('/testend', {replace: true});
    } catch (error) {
      console.error('failed to submit user feedback form:', error)
    }

  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4" style={{color: "#1c4b74"}}>Candidate Feedback Form</h2>
      <p style={{color: "red", fontWeight: "600", textAlign: 'center'}}>"Filling out this feedback form is mandatory. Failure to submit the form will result in the disqualification of your test results." </p>
      <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
        {/* Question 1 */}
        <div className="mb-4 p-3 border rounded">
          <label className="form-label fw-bold">
            1. Would you like to submit a request to reattempt the test due to any technical difficulties?*
          </label>
          <div className=" custom-form-check">
            <input
              type="radio"
              id="facedIssuesYes"
              name="facedIssues"
              value="YES"
              className="custom-radio me-3 "
              required
              checked={feedback.facedIssues === "YES"}
              onChange={(e) => handleInputChange("facedIssues", e.target.value)}
            />
            <label htmlFor="facedIssuesYes" className="form-check-label">
              Yes
            </label>
            
          </div>
          
          <div className=" custom-form-check">
            <input
              type="radio"
              id="facedIssuesNo"
              name="facedIssues"
              value="NO"
              className="custom-radio me-3"
              required
              checked={feedback.facedIssues === "NO"}
              onChange={(e) => handleInputChange("facedIssues", e.target.value)}
            />
            <label htmlFor="facedIssuesNo" className="form-check-label">
              No
            </label>
          </div>
        </div>

        {/* Question 2 */}
        {feedback.facedIssues === "YES" && (
          <div className="mb-4">
            <label className="form-label fw-bold">
              If 'YES', please share the issues you faced.*
            </label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Describe the issues you faced"
              value={feedback.issuesDetails}
              onChange={(e) => handleInputChange("issuesDetails", e.target.value)}
            />
          </div>
        )}

        {/* Question 3: Anti-cheating measure */}
        <div className="mb-4 p-3 border rounded">
          <h5>2. Anti-cheating Measure*</h5>
          <div className="mb-3">
            <label className="form-label">
              a. Were anti-cheating instructions clear?
            </label>
            <div className=" custom-form-check">
              <input
                type="radio"
                id="instructionsClearYes"
                name="instructionsClear"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.antiCheating.instructionsClear === "YES"}
                onChange={(e) =>
                  handleInputChange("instructionsClear", e.target.value, "antiCheating")
                }
              />
              <label htmlFor="instructionsClearYes" className="form-check-label">
                Yes
              </label>
            </div>
            <div className=" custom-form-check">
              <input
                type="radio"
                id="instructionsClearNo"
                name="instructionsClear"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.antiCheating.instructionsClear === "NO"}
                onChange={(e) =>
                  handleInputChange("instructionsClear", e.target.value, "antiCheating")
                }
              />
              <label htmlFor="instructionsClearNo" className="form-check-label">
                No
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">
            b. Do you think these anti-cheating measures are enough deterrent for students to not do cheating?
            </label>
            <div className=" custom-form-check">
              <input
                type="radio"
                id="deterrentMeasuresYes"
                name="deterrentMeasures"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.antiCheating.deterrentMeasures === "YES"}
                onChange={(e) =>
                  handleInputChange("deterrentMeasures", e.target.value, "antiCheating")
                }
              />
              <label htmlFor="deterrentMeasuresYes" className="form-check-label">
                Yes
              </label>
            </div>
            <div className=" custom-form-check">
              <input
                type="radio"
                id="deterrentMeasuresNo"
                name="deterrentMeasures"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.antiCheating.deterrentMeasures === "NO"}
                onChange={(e) =>
                  handleInputChange("deterrentMeasures", e.target.value, "antiCheating")
                }
              />
              <label htmlFor="deterrentMeasuresNo" className="form-check-label">
                No
              </label>
            </div>
          </div>


         

          <div className="mb-3">
            <label className="form-label">
              c. Is there any way you think candidates can still cheat and how we can prevent it?
            </label>
            <textarea
              rows="2"
              className="form-control"
              placeholder="Your thoughts"
              required
              value={feedback.antiCheating.cheatingPrevention}
              onChange={(e) =>
                handleInputChange("cheatingPrevention", e.target.value, "antiCheating")
              }
            />
          </div>

        </div>

        {/* cam1 & am2 authentication */}
        <div className="mb-4 p-3 border rounded">
          <h5>3. Setup of Face Authentication and 2nd Camera.*</h5>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
          <label className="form-label">
            Was it easy enough to follow?
          </label>
        

           <div className=" custom-form-check">
              <input
                type="radio"
                id="setupEasyFaceYes"
                name="setupEasyFace"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.faceAuth.setupEasyFace === "YES"}
                onChange={(e) =>
                  handleInputChange("setupEasyFace", e.target.value, "faceAuth")
                }
              />
              <label htmlFor="setupEasyFaceYes" className="form-check-label">
                Yes
              </label>
            </div>
            
            <div className=" custom-form-check">
              <input
                type="radio"
                id="setupEasyFaceNo"
                name="setupEasyFace"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.faceAuth.setupEasyFace === "NO"}
                onChange={(e) =>
                  handleInputChange("setupEasyFace", e.target.value, "faceAuth")
                }
              />
              <label htmlFor="setupEasyFaceNo" className="form-check-label">
                No
              </label>
            </div>
            </div>
            <img style={{borderRadius:'5px'}} src={faceAuth} width={300} height={200} />
            </div>
            {feedback.faceAuth.setupEasyFace === "NO" && (
          <div className="mb-4">
            <label className="form-label fw-bold">
              If 'NO', please share the issues you faced.*
            </label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Describe the issues you faced"
              value={feedback.faceAuth.setupFaceIssue}
              onChange={(e) => handleInputChange("setupFaceIssue", e.target.value,'faceAuth' )}
            />
          </div>
              )}

        </div>

       {/* media sharing */}
        <div className="mb-4 p-3 border rounded">
          <h5>4. Setup of Audio, Video, and Screen Sharing.*</h5>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
          <label className="form-label">
            Was it easy enough to follow?
          </label>
         

            <div className=" custom-form-check">
              <input
                type="radio"
                id="setupEasyMediaYes"
                name="setupEasyMedia"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.mediaSharing.setupEasyMedia === "YES"}
                onChange={(e) =>
                  handleInputChange("setupEasyMedia", e.target.value, "mediaSharing")
                }
              />
              <label htmlFor="setupEasyMediaYes" className="form-check-label">
                Yes
              </label>
            </div>
            
            <div className=" custom-form-check">
              <input
                type="radio"
                id="setupEasyMediaNo"
                name="setupEasyMedia"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.mediaSharing.setupEasyMedia === "NO"}
                onChange={(e) =>
                  handleInputChange("setupEasyMedia", e.target.value, "mediaSharing")
                }
              />
              <label htmlFor="setupEasyMediaNo" className="form-check-label">
                No
              </label>
            </div>
            </div>
            <img style={{borderRadius:'5px'}} src={permission} width={300} height={200} />
            </div>
            {feedback.mediaSharing.setupEasyMedia === "NO" && (
          <div className="mb-4">
            <label className="form-label fw-bold">
              If 'NO', please share the issues you faced.*
            </label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Describe the issues you faced"
              value={feedback.mediaSharing.setupMediaIssue}
              onChange={(e) => handleInputChange("setupMediaIssue", e.target.value,'mediaSharing' )}
            />
          </div>
              )}
        </div>

              {/* test platform */}
        {testInfo?.testtype === "coding" && 
        <div className="mb-4 p-3 border rounded">
          <h5>5. Ease of Use of Test Platform.*</h5>
          <div className="mb-3">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
          <label className="form-label">a. Was there any confusion in using the run button?</label>
          
            <div className=" custom-form-check">
              <input
                type="radio"
                id="runButtonConfusionYes"
                name="runButtonConfusion"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.runButtonConfusion === "YES"}
                onChange={(e) =>
                  handleInputChange("runButtonConfusion", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="runButtonConfusionYes" className="form-check-label">
                Yes
              </label>
            </div>
            
            <div className=" custom-form-check">
              <input
                type="radio"
                id="runButtonConfusionNo"
                name="runButtonConfusion"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.runButtonConfusion === "NO"}
                onChange={(e) =>
                  handleInputChange("runButtonConfusion", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="runButtonConfusionNo" className="form-check-label">
                No
              </label>
            </div>
            </div>
            <img style={{borderRadius:'5px'}} src={runBtn} width={300} height={200} />
            </div>
            {feedback.platformUsage.runButtonConfusion === "YES" && (
          <div className="mb-4">
            <label className="form-label fw-bold">
              If 'YES', please share the issues you faced.*
            </label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Describe the issues you faced"
              value={feedback.platformUsage.runButtonIssue}
              onChange={(e) => handleInputChange("runButtonIssue", e.target.value,'platformUsage' )}
            />
          </div>
              )}

          </div>

          <div className="mb-3">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
          <label className="form-label">b. Is the purpose of the submit button clear?</label>
          

            <div className=" custom-form-check">
              <input
                type="radio"
                id="submitButtonPurposeYes"
                name="submitButtonPurpose"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.submitButtonPurpose === "YES"}
                onChange={(e) =>
                  handleInputChange("submitButtonPurpose", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="submitButtonPurposeYes" className="form-check-label">
                Yes
              </label>
            </div>
            
            <div className=" custom-form-check">
              <input
                type="radio"
                id="submitButtonPurposeNo"
                name="submitButtonPurpose"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.submitButtonPurpose === "NO"}
                onChange={(e) =>
                  handleInputChange("submitButtonPurpose", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="submitButtonPurposeNo" className="form-check-label">
                No
              </label>
            </div>
            </div>
            <img style={{borderRadius:'5px'}} src={submitBtn} width={300} height={200} />
            </div>
            {feedback.platformUsage.submitButtonPurpose === "NO" && (
          <div className="mb-4">
            <label className="form-label fw-bold">
              If 'NO', please share the issues you faced.*
            </label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Describe the issues you faced"
              value={feedback.platformUsage.submitButtonIssue}
              onChange={(e) => handleInputChange("submitButtonIssue", e.target.value,'platformUsage' )}
            />
          </div>
              )}

        </div>

        <div className="mb-3">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
          <label className="form-label">c. Was "input" and "output" box usage clear?</label>
         

            <div className=" custom-form-check">
              <input
                type="radio"
                id="inputOutputClearYes"
                name="inputOutputClear"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.inputOutputClear === "YES"}
                onChange={(e) =>
                  handleInputChange("inputOutputClear", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="inputOutputClearYes" className="form-check-label">
                Yes
              </label>
            </div>
            
            <div className=" custom-form-check">
              <input
                type="radio"
                id="inputOutputClearNo"
                name="inputOutputClear"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.inputOutputClear === "NO"}
                onChange={(e) =>
                  handleInputChange("inputOutputClear", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="inputOutputClearNo" className="form-check-label">
                No
              </label>
            </div>            
          </div>
          <img style={{borderRadius:'5px'}} src={inpOutBox} width={300} height={200} />
        </div>

            
            {feedback.platformUsage.inputOutputClear === "NO" && (
          <div className="mb-4">
            <label className="form-label fw-bold">
              If 'NO', please share the issues you faced.*
            </label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Describe the issues you faced"
              value={feedback.platformUsage.inputOutputIssue}
              onChange={(e) => handleInputChange("inputOutputIssue", e.target.value,'platformUsage' )}
            />
          </div>
              )}

        </div>



        <div className="mb-3">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
          <label style={{maxWidth: '500px'}} className="form-label">d. Was this instruction clear - “make sure you are not using <strong>print</strong>  to output, rather use <strong>return</strong> to output results.” ?
          </label>
         

            <div className=" custom-form-check">
              <input
                type="radio"
                id="returnInstructionClearYes"
                name="returnInstructionClear"
                value="YES"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.returnInstructionClear === "YES"}
                onChange={(e) =>
                  handleInputChange("returnInstructionClear", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="returnInstructionClearYes" className="form-check-label">
                Yes
              </label>
            </div>
            
            <div className=" custom-form-check">
              <input
                type="radio"
                id="returnInstructionClearNo"
                name="returnInstructionClear"
                value="NO"
                className="custom-radio me-3"
                required
                checked={feedback.platformUsage.returnInstructionClear === "NO"}
                onChange={(e) =>
                  handleInputChange("returnInstructionClear", e.target.value, "platformUsage")
                }
              />
              <label htmlFor="returnInstructionClearNo" className="form-check-label">
                No
              </label>
            </div>
            </div>
            <img style={{borderRadius:'5px'}} src={rtnOut} width={300} height={200} />
            </div>
            {feedback.platformUsage.returnInstructionClear === "NO" && (
          <div className="mb-4">
            <label className="form-label fw-bold">
              If 'NO', please share the issues you faced.*
            </label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Describe the issues you faced"
              value={feedback.platformUsage.returnInstructionIssue}
              onChange={(e) => handleInputChange("returnInstructionIssue", e.target.value,'platformUsage' )}
            />
          </div>
              )}

        </div>

        </div>
        }

        <button 
          type="submit"
           className="btn btn-primary w-100"
           style={{ backgroundColor: '#5880F0 ', color: 'white' }}
           >
          Submit Feedback
        </button>
        
      </form>
      

    </div>
  );
};

export default UserFeedback;
