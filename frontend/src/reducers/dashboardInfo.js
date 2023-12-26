const initialState = {
    hrName: "",
    totalTests: [],
}

const dashBoardInfo = (state = initialState, action) => {
    switch(action.type){
        case "UPDATE_DASHBOARD_INFO":
            return {hrName: action.hrname, totalTests: [...action.totaltests]};
        default:
            return state;
    }
};

export default dashBoardInfo;