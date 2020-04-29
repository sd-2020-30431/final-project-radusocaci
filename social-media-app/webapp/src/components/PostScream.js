import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {clearErrors, postScream} from '../redux/actions/dataActions';
import CustomButton from '../util/CustomButton';
import {Add} from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
    ...theme.others,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    }
});

class PostScream extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
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
                open: false,
                errors: {}
            });
        }
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    };

    handleClose = () => {
        this.props.clearErrors();
        this.setState({
            open: false,
            errors: {}
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postScream({
            body: this.state.body
        });
    };

    render() {
        const {errors} = this.state;
        const {
            classes,
            UI: {
                loading
            }
        } = this.props;
        return (
            <Fragment>
                <CustomButton onClick={this.handleOpen}
                              tip={'Post a scream'}>
                    <Add color={'primary'}/>
                </CustomButton>
                <Dialog open={this.state.open}
                        onClose={this.handleClose}
                        fullWidth
                        maxWidth={'sm'}>
                    <DialogTitle>
                        Post a new scream
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField name={'body'}
                                       type={'text'}
                                       label={'What\'s on your mind?'}
                                       multiline
                                       rows={'3'}
                                       placeholder={'Post a scream'}
                                       error={!!errors.body}
                                       helperText={errors.body}
                                       className={classes.textField}
                                       onChange={this.handleChange}
                                       fullWidth/>
                            <Button type={'submit'}
                                    variant={'contained'}
                                    color={'primary'}
                                    className={classes.submitButton}
                                    disabled={loading}>
                                Submit
                                {loading && (
                                    <CircularProgress size={30}
                                                      className={classes.progressSpinner}/>
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

PostScream.propTypes = {
    UI: PropTypes.object.isRequired,
    postScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const mapActionsToProps = {
    postScream,
    clearErrors
};

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostScream));