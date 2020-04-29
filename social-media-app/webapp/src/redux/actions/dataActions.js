import {
    CLEAR_ERRORS,
    DELETE_SCREAM,
    LIKE_SCREAM,
    LOADING_DATA,
    LOADING_UI,
    POST_SCREAM,
    SET_ERRORS,
    SET_SCREAM,
    SET_SCREAMS,
    STOP_LOADING_UI,
    SUBMIT_COMMENT,
    UNLIKE_SCREAM
} from '../types';
import axios from 'axios';

export const getScreams = () => (dispatch) => {
    dispatch({
        type: LOADING_DATA
    });
    axios.get('/screams')
        .then(res => {
            dispatch({
                type: SET_SCREAMS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: SET_SCREAMS,
                payload: []
            });
            console.error(err);
        });
};

export const getScream = (screamId) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    });
    axios.get(`/screams/${screamId}`)
        .then(res => {
            dispatch({
                type: SET_SCREAM,
                payload: res.data
            });
            dispatch({
                type: STOP_LOADING_UI // needed cause its in a different reducer
            });
        })
        .catch(err => console.error(err));
};

export const likeScream = (screamId) => (dispatch) => {
    axios.get(`/screams/${screamId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_SCREAM,
                payload: res.data
            });
        })
        .catch(err => console.error(err));
};

export const unlikeScream = (screamId) => (dispatch) => {
    axios.get(`/screams/${screamId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_SCREAM,
                payload: res.data
            });
        })
        .catch(err => console.error(err));
};

export const deleteScream = (screamId) => (dispatch) => {
    axios.delete(`/screams/${screamId}`)
        .then(() => {
            dispatch({
                type: DELETE_SCREAM,
                payload: screamId
            });
        })
        .catch(err => console.error(err));
};

export const postScream = (newScream) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    });
    axios.post('/screams', newScream)
        .then((res) => {
            dispatch({
                type: POST_SCREAM,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => dispatch({
            type: SET_ERRORS,
            payload: err.response.data
        }));
};

export const clearErrors = () => (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};

export const submitComment = (screamId, commentData) => (dispatch) => {
    axios.post(`/screams/${screamId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};