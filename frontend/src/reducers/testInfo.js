const intialState = {
  testtype:"",
  language: "",
  difficulty: "",
  questions: "",
  duration: "",
  candidateEmail: "",
  testCode: "",
};

const testInfo = (state = intialState, action) => {
  switch (action.type) {
    case "TEST_INFO":
      return {
        testtype: action.testtype,
        language: action.language,
        difficulty: action.difficulty,
        questions: action.questions,
        duration: action.duration,
        testCode: action.testcode,
        candidateEmail: action.candidateemail,
      };
    default:
      return state;
  }
};

export default testInfo;
