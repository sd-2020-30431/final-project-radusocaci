import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import AppIcon from '../images/icon.png';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto 20px auto'
    },
    pageTitle: {
        margin: '10px auto 10px auto'
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        margin: '20px auto 10px auto',
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: '10px'
    },
    progress: {
        position: 'absolute'
    }
};

class Signup extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            loading: false,
            errors: {}
        };
    }

    handleSubmit = (event) => {
        event.preventDefault(); // email/pass wont show in url
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        axios.post('/signup', newUserData)
            .then(res => {
                localStorage.setItem('idToken', `Bearer ${res.data.token}`);
                this.setState({
                    loading: false
                });
                this.props.history.push('/'); // redirect to homepage
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                });
            });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const {classes} = this.props;
        const {errors, loading} = this.state;
        return (
            <Grid container
                  className={classes.form}>
                <Grid item
                      sm/>
                <Grid item
                      sm>
                    <img src={AppIcon}
                         alt={'monkey'}
                         className={classes.image}/>
                    <Typography variant={'h2'}
                                className={classes.pageTitle}>
                        Sign Up
                    </Typography>
                    <form noValidate
                          onSubmit={this.handleSubmit}>
                        <TextField id={'email'}
                                   name={'email'}
                                   type={'email'}
                                   label={'email'}
                                   className={classes.textField}
                                   helperText={errors.email}
                                   error={!!errors.email}
                                   value={this.state.email}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <TextField id={'password'}
                                   name={'password'}
                                   type={'password'}
                                   label={'password'}
                                   className={classes.textField}
                                   helperText={errors.password}
                                   error={!!errors.password}
                                   value={this.state.password}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <TextField id={'confirmPassword'}
                                   name={'confirmPassword'}
                                   type={'password'}
                                   label={'confirmPassword'}
                                   className={classes.textField}
                                   helperText={errors.confirmPassword}
                                   error={!!errors.confirmPassword}
                                   value={this.state.confirmPassword}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <TextField id={'handle'}
                                   name={'handle'}
                                   type={'text'}
                                   label={'handle'}
                                   className={classes.textField}
                                   helperText={errors.handle}
                                   error={!!errors.handle}
                                   value={this.state.handle}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        {errors.general && (
                            <Typography variant={'body2'}
                                        className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                                className={classes.button}
                                disabled={loading}>
                            {loading && (
                                <CircularProgress size={30}
                                                  className={classes.progress}/>
                            )}
                            Sign Up
                        </Button>
                        <br/>
                        <small>Already have an account? Log in <Link to={'/login'}>here</Link></small>
                    </form>
                </Grid>
                <Grid item
                      sm/>
            </Grid>
        );
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
