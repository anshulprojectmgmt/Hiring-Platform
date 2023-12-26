const initialState = {
  questions: [],
  currentQuestion: 0
};

const getQuestion = (state = initialState, action) => {
    switch (action.type) {
        case "SET_QUESTION":
          return {...state, questions: [...action.payload]};
        case "NEXT_QUESTION":
          return {...state, currentQuestion: state.currentQuestion + 1}
        case "PREV_QUESTION":
          return {...state, currentQuestion: state.currentQuestion - 1}
        default:
          return state;
      }
}

export default getQuestion;