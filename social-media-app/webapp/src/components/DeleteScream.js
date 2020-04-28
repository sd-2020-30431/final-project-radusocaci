import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import CustomButton from '../util/CustomButton';
import {deleteScream} from '../redux/actions/dataActions';
import withStyles from '@material-ui/core/styles/withStyles';
import {connect} from 'react-redux';
import {DeleteOutline} from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
    ...theme.others,
    deleteButton: {
        left: '90%',
        top: '10%',
        position: 'absolute'
    }
});

class DeleteScream extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    deleteScream = () => {
        this.props.deleteScream(this.props.screamId);
        this.setState({
            open: false
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <CustomButton tip={'Delete scream'}
                              onClick={this.handleOpen}
                              btnClassName={classes.deleteButton}>
                    <DeleteOutline color={'secondary'}/>
                </CustomButton>
                <Dialog open={this.state.open}
                        onClose={this.handleClose}
                        fullWidth
                        maxWidth={'sm'}>
                    <DialogTitle>
                        This action cannot be reversed? Do you want to proceed?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose}
                                color={'primary'}>
                            Cancel
                        </Button>
                        <Button onClick={this.deleteScream}
                                color={'secondary'}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
};

const mapActionsToProps = {
    deleteScream
};

export default connect(null, mapActionsToProps)(withStyles(styles)(DeleteScream));