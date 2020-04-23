const isEmpty = (string) => {
    return string.trim() === '';
};

const isEmailValid = (email) => {
    const regExp = '^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$';
    return email.match(regExp);
};

exports.validateSignupData = (data) => {
    let error = {};

    if (isEmpty(data.email)) {
        error.email = 'Must not be empty';
    } else if (!isEmailValid(data.email)) {
        error.email = 'Must be a valid email address';
    }

    if (isEmpty(data.password)) {
        error.password = 'Must not be empty';
    } else if (data.password !== data.confirmPassword) {
        error.password = 'Passwords must match';
    }

    if (isEmpty(data.handle)) {
        error.handle = 'Must not be empty';
    }

    return {
        error,
        valid: Object.keys(error).length === 0
    };
};

exports.validateLoginData = (data) => {
    let error = {};

    if (isEmpty(data.email)) {
        error.email = 'Must not be empty';
    } else if (!isEmailValid(data.email)) {
        error.email = 'Must be a valid email address';
    }

    if (isEmpty(data.password)) {
        error.password = 'Must not be empty';
    }

    return {
        error,
        valid: Object.keys(error).length === 0
    };
};

exports.validateUserDetails = (data) => {
    let userDetails = {};

    if (!isEmpty(data.bio.trim())) {
        userDetails.bio = data.bio.trim();
    }
    if (!isEmpty(data.website.trim())) {
        userDetails.website = (data.website.trim().substring(0, 4) !== 'http') ? `http://${data.website.trim()}` : data.website.trim();
    }
    if (!isEmpty(data.location.trim())) {
        userDetails.location = data.location.trim();
    }

    return userDetails;
};