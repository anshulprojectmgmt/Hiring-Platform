import editorTheme from "./editorSetting";
import getQuestion from "./getQuestion";
import savedCode from "./savedCode";
import testInfo from "./testInfo";
import { combineReducers } from "redux";
import dashBoardInfo from "./dashboardInfo";
import savedMcq from "./savedMcq";
import instructionState from "./instructionState";
import savedSubjective from "./savedSubjective";
import candidateResult from "./candidateResult";

const reducer = combineReducers({
  editorTheme,
  getQuestion,
  savedCode,
  testInfo,
  dashBoardInfo,
  savedMcq,
  instructionState,
  savedSubjective,
  candidateResult,
});

export default reducer;
  
