const initialState = {
    currentpage: 1,
};

const instructionState = (state = initialState, action) => {
    switch(action.type){
        case "NEXT":
            return {currentpage: state.currentpage+1};
        case "BACK":
            return {currentpage: state.currentpage-1};
        default:
            return state;
    }
};

export default instructionState;