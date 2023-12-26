const initialState = [
  {
    lang: "",
    queNumber: -10,
    question: "",
    code: ``,
    score: 0,
  },
];
const savedCode = (state = initialState, action) => {
  switch (action.type) {
    case "UPLOAD_CODE":
      const existingIndex = state.findIndex(
        (item) => item.question === action.question
      );
      if (existingIndex !== -1) {
        return state.map((item, idx) =>
          idx === existingIndex
            ? { ...item, lang: action.language, code: action.code, score: action.score }
            : item
        );
      } else {
        return [
          ...state,
          {
            lang: action.language,
            question: action.question,
            code: action.code,
            queNumber: action.queNumber,
            score: action.score,
          },
        ];
      }
    default:
      return state;
  }
};

export default savedCode;
