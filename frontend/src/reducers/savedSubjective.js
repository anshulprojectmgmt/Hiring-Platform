import { REHYDRATE } from "redux-persist";
const initialState = [
    {
      question: "",
      subjVideoUrl: "",
      speechResult:{}
      
    },
];

const savedSubjective = (state = initialState, action) => {
    switch (action.type) {
      case "UPLOAD_SUBJECTIVE":
        const existingIndex = state.findIndex(
          (item) => item.question === action.question
        );
        if (existingIndex !== -1) {
          return state.map((item, idx) =>
            idx === existingIndex
              ?  {
                question: action.question,
                subjVideoUrl: action.blobUrl,
                speechResult: action.speechResult
                 }
              : item
          );
        } else {
          return [
            ...state,
            {
                question: action.question,
                subjVideoUrl: action.blobUrl,
                speechResult: action.speechResult
                
            },
          ];
        }
      default:
        return state;
    }
  };

export default savedSubjective;