import { REHYDRATE } from "redux-persist";
const initialState = [
    {
      question: "",
      subjVideoUrl: "",
      
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
                 }
              : item
          );
        } else {
          return [
            ...state,
            {
                question: action.question,
                subjVideoUrl: action.blobUrl,
                
            },
          ];
        }
      default:
        return state;
    }
  };

export default savedSubjective;