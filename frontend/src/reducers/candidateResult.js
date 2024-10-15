const intialState = {
   candidateResult: null,
   videoIndex: -1
  };
  
  const candidateResult = (state = intialState, action) => {
    switch (action.type) {
      case "SET_VIDEO_INDX":
        return {
         candidateResult: action.candidateResult,
         videoIndex: action.index
        };
      default:
        return state;
    }
  };
  
  export default candidateResult;
  