import editorTheme from "./editorSetting";
import getQuestion from "./getQuestion";
import savedCode from "./savedCode";
import testInfo from "./testInfo";
import { combineReducers } from "redux";
import dashBoardInfo from "./dashboardInfo";
import savedMcq from "./savedMcq";
import instructionState from "./instructionState";
import savedSubjective from "./savedSubjective";

const reducer = combineReducers({
  editorTheme,
  getQuestion,
  savedCode,
  testInfo,
  dashBoardInfo,
  savedMcq,
  instructionState,
  savedSubjective,
});

export default reducer;
  
