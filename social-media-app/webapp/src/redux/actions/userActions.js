import {
    CLEAR_ERRORS,
    LOADING_UI,
    LOADING_USER,
    NOTIFICATIONS_READ,
    SET_ERRORS,
    SET_UNAUTHENTICATED,
    SET_USER
} from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    });
    axios.post('/login', userData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({
                type: CLEAR_ERRORS
            });
            history.push('/'); // redirect to homepage
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const getUserData = () => (dispatch) => {
    dispatch({
        type: LOADING_USER
    });
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            });
        })
        .catch(err => console.error(err));
};

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({
        type: LOADING_UI
    });
    axios.post('/signup', newUserData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({
                type: CLEAR_ERRORS
            });
            history.push('/'); // redirect to homepage
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('idToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({
        type: SET_UNAUTHENTICATED
    });
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({
        type: LOADING_USER
    });
    axios.post('/user/image', formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.error(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({
        type: LOADING_USER
    });
    axios.post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.error(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
    axios.post('/notifications', notificationIds)
        .then(() => {
            dispatch({
                type: NOTIFICATIONS_READ
            });
        })
        .catch(err => console.error(err));
};

const setAuthorizationHeader = (token) => {
    localStorage.setItem('idToken', `Bearer ${token}`);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};