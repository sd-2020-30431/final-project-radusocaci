import {LIKE_SCREAM, LOADING_DATA, SET_SCREAMS, UNLIKE_SCREAM, DELETE_SCREAM} from '../types';
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