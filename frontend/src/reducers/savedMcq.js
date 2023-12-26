const initialState = [
    {
      question: "",
      optionSelected: "",
      score: 0,
    },
];

const savedMcq = (state = initialState, action) => {
    switch (action.type) {
      case "UPLOAD_MCQ":
        const existingIndex = state.findIndex(
          (item) => item.question === action.question
        );
        if (existingIndex !== -1) {
          return state.map((item, idx) =>
            idx === existingIndex
              ? { ...item, optionSelected:action.optionSelected, score: action.score }
              : item
          );
        } else {
          return [
            ...state,
            {
                question: action.question,
                optionSelected: action.optionSelected,
                score: action.score,
            },
          ];
        }
      default:
        return state;
    }
  };

export default savedMcq;