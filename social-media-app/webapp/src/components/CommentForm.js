import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {submitComment} from '../redux/actions/dataActions';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
    ...theme.others,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinner: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
});

class CommentForm extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            body: '',
            errors: {}
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        } else if (!nextProps.UI.loading) {
            this.setState({
                body: '',
                errors: {}
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.screamId, {
            body: this.state.body
        });
    };

    render() {
        const {
            classes,
            authenticated
        } = this.props;
        const errors = this.state.errors;
        return authenticated ? (
            <Grid item
                  sm={12}
                  style={{textAlign: 'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <TextField name={'body'}
                               type={'text'}
                               label={'Comment on scream'}
                               error={!!errors.comment}
                               helperText={errors.comment}
                               value={this.state.body}
                               onChange={this.handleChange}
                               fullWidth
                               className={classes.textField}/>
                    <Button type={'submit'}
                            variant={'contained'}
                            color={'primary'}
                            className={classes.button}>
                        Submit
                    </Button>
                </form>
                {/*<hr className={classes.visibleSeparator}/>*/}
            </Grid>
        ) : null;
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapActionsToProps = {
    submitComment
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CommentForm));