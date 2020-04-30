import React, {Component, Fragment} from 'react';
import CustomButton from '../util/CustomButton';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {clearErrors, getScream} from '../redux/actions/dataActions';
import withStyles from '@material-ui/core/styles/withStyles';
import {Chat, UnfoldMore} from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

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

class ScreamDialog extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            oldPath: '',
            newPath: ''
        };
    }

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;
        const {userHandle, screamId} = this.props;
        const newPath = `/users/${userHandle}/scream/${screamId}`;
        if (oldPath === newPath) {
            oldPath = `/users/${userHandle}`;
        }
        window.history.pushState(null, null, newPath); // simply change to url
        this.setState({
            open: true,
            oldPath,
            newPath
        });
        this.props.getScream(this.props.screamId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({
            open: false
        });
        this.props.clearErrors();
    };

    render() {
        const {
            classes,
            scream: {
                screamId,
                body,
                createdAt,
                likeCount,
                commentCount,
                userImage,
                userHandle,
                comments
            },
            UI: {
                loading
            }
        } = this.props;
        const dialogMarkup = loading ? (
            <div className={classes.spinner}>
                <CircularProgress size={200}
                                  thickness={2}/>
            </div>
        ) : (
            <Grid container
                  spacing={16}>
                <Grid item
                      sm={5}>
                    <img src={userImage}
                         alt={'Profile'}
                         className={classes.profileImage}/>
                </Grid>
                <Grid item
                      sm={7}>
                    <Typography component={Link}
                                color={'primary'}
                                variant={'h5'}
                                to={`/users/${userHandle}`}>
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant={'body2'}
                                color={'textSecondary'}>
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant={'body1'}>
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} likes</span>
                    <CustomButton tip={'comments'}>
                        <Chat color={'primary'}/>
                    </CustomButton>
                    <span>{commentCount} Comments</span>
                </Grid>
                <CommentForm screamId={screamId}/>
                <Comments comments={comments}/>
            </Grid>
        );
        return (
            <Fragment>
                <CustomButton onClick={this.handleOpen}
                              tip={'Expand scream'}
                              tipClassName={classes.expandButton}>
                    <UnfoldMore color={'primary'}/>
                </CustomButton>
                <Dialog open={this.state.open}
                        onClose={this.handleClose}
                        fullWidth
                        maxWidth={'sm'}>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

ScreamDialog.propTypes = {
    getScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapActionsToProps = {
    getScream,
    clearErrors
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    scream: state.data.scream
});

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));