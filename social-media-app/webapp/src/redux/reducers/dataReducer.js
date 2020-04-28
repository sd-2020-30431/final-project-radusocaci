import {DELETE_SCREAM, LIKE_SCREAM, LOADING_DATA, SET_SCREAMS, UNLIKE_SCREAM} from '../types';

const initialState = {
    screams: [],
    scream: {},
    loading: false
};

export default function (state = initialState, action) { //initial value like python
    switch (action.type) {
        case SET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loading: false
            };
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            let index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload;
            return {
                ...state
            };
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case DELETE_SCREAM:
            state.screams = state.screams.filter(scream => scream.screamId !== action.payload);
            return {
                ...state
            };
        default:
            return state;
    }
}