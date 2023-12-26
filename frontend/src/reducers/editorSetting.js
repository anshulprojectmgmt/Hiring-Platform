import { CodeStatus } from "../compiler/Compiler";

const intialState = {
    language: "Python",
    theme: "vs-dark",
    fontSize: '16px',
    codeStatus: CodeStatus.Finished,
  };
  
  const editorTheme = (state = intialState, action) => {
    switch (action.type) {
      case "CHANGE_LANGUAGE":
        return { ...state, language: action.payload };
      case "CHANGE_THEME":
        return { ...state, theme: action.payload };
      case "CHANGE_FONT_SIZE":
        return { ...state, fontSize: action.payload };
      case "CHANGE_CODE_STATUS":
        return { ...state, codeStatus: action.payload };
      default:
        return state;
    }
  };

  export default editorTheme;