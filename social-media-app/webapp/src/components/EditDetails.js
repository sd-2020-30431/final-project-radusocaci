import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import {editUserDetails} from '../redux/actions/userActions';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CustomButton from '../util/CustomButton';

const styles = (theme) => ({
    ...theme.others,
    button: {
        float: 'right'
    }
});

class EditDetails extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            bio: '',
            website: '',
            location: '',
            open: false
        };
    }

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : '',
        });
    };

    handleOpen = () => {
        this.setState({
            open: true
        });
        this.mapUserDetailsToState(this.props.credentials);
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    componentDidMount() {
        const {credentials} = this.props;
        this.mapUserDetailsToState(credentials);
    }

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <CustomButton tip={'Edit details'}
                              onClick={this.handleOpen}
                              btnClassName={classes.button}>
                    <EditIcon color={'primary'}/>
                </CustomButton>
                <Dialog open={this.state.open}
                        onClose={this.handleClose}
                        fullWidth
                        maxWidth={'sm'}>
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField name={'bio'}
                                       type={'text'}
                                       label={'bio'}
                                       multiline
                                       rows={'3'}
                                       placeholder={'A short bio about yourself'}
                                       className={classes.textField}
                                       value={this.state.bio}
                                       onChange={this.handleChange}
                                       fullWidth/>
                            <TextField name={'website'}
                                       type={'text'}
                                       label={'website'}
                                       placeholder={'Your personal/professional website'}
                                       className={classes.textField}
                                       value={this.state.website}
                                       onChange={this.handleChange}
                                       fullWidth/>
                            <TextField name={'location'}
                                       type={'text'}
                                       label={'location'}
                                       placeholder={'Where you live'}
                                       className={classes.textField}
                                       value={this.state.location}
                                       onChange={this.handleChange}
                                       fullWidth/>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}
                                color={'primary'}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit}
                                color={'primary'}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

const mapActionsToProps = {
    editUserDetails
};

EditDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    credentials: PropTypes.object.isRequired,
    editUserDetails: PropTypes.func.isRequired
};


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails));