import {
    DELETE_SCREAM,
    LIKE_SCREAM,
    LOADING_DATA,
    POST_SCREAM,
    SET_SCREAM,
    SET_SCREAMS,
    SUBMIT_COMMENT,
    UNLIKE_SCREAM
} from '../types';

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
        case SET_SCREAM:
            return {
                ...state,
                scream: action.payload
            };
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            let index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload;
            if (state.scream.screamId === action.payload.screamId) {
                state.scream = {
                    ...state.scream,
                    likeCount: action.payload.likeCount
                };
            }
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
        case POST_SCREAM:
            return {
                ...state,
                screams: [
                    action.payload,
                    ...state.screams
                ]
            };
        case SUBMIT_COMMENT:
            let index2 = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
            state.screams[index2] = {
                ...state.screams[index2],
                commentCount: state.screams[index2].commentCount + 1
            };
            return {
                ...state,
                scream: {
                    ...state.scream,
                    commentCount: state.scream.commentCount + 1,
                    comments: [
                        action.payload,
                        ...state.scream.comments
                    ]
                }
            };
        default:
            return state;
    }
}