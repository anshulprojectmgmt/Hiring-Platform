const initialState = {
    video: null,
    audio: null,
    screen: null,
};

const userMediaStore = (state = initialState, action) => {
    switch(action.type){
        case "SCREEN":
            return {...state, screen: action.screen};
        case "VIDEO":
            return {...state, video: action.video};
        case "AUDIO":
            return {...state, audio: action.audio};
        default:
            return state;
    }
};

export default userMediaStore;