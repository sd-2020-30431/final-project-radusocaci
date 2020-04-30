import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import dayjs from 'dayjs';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import {logoutUser, uploadImage} from '../redux/actions/userActions';
import {KeyboardReturn} from '@material-ui/icons';
import EditDetails from './EditDetails';
import CustomButton from '../util/CustomButton';
import ProfileSkeleton from '../util/ProfileSkeleton';

const styles = (theme) => ({
    ...theme.others
});

class Profile extends Component {

    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    };

    handleEditPicture = () => { // trigger image selection using custom button
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    handleLogout = () => {
        this.props.logoutUser();
    };

    render() {
        const {
            classes,
            user: {
                authenticated,
                loading,
                credentials: {
                    handle,
                    createdAt,
                    imageUrl,
                    bio,
                    website,
                    location
                }
            }
        } = this.props;

        return !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl}
                             alt="profile"
                             className="profile-image"/>
                        <input type={'file'}
                               id={'imageInput'}
                               hidden={'hidden'}
                               onChange={this.handleImageChange}/>
                        <CustomButton tip={'Edit profile picture'}
                                      onClick={this.handleEditPicture}
                                      btnClassName={'button'}>
                            <EditIcon color={'primary'}/>
                        </CustomButton>
                    </div>
                    <hr/>
                    <div className="profile-details">
                        <MuiLink component={Link}
                                 to={`users/${handle}`}
                                 color={'primary'}
                                 variant={'h5'}>
                            @{handle}
                        </MuiLink>
                        <hr/>
                        {bio && <Typography variant={'body2'}>{bio}</Typography>}
                        <hr/>
                        {location && (
                            <Fragment>
                                <LocationOn color={'primary'}/> <span>{location}</span>
                                <hr/>
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color={'primary'}/>
                                <a href={website}
                                   target={'_blank'}
                                   rel={'noopener noreferrer'}>
                                    {' '}{website}
                                </a>
                                <hr/>
                            </Fragment>
                        )}
                        <CalendarToday color={'primary'}/>{' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    <CustomButton tip={'Log Out'}
                                  onClick={this.handleLogout}>
                        <KeyboardReturn color={'primary'}/>
                    </CustomButton>
                    <EditDetails/>
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant={'body2'}
                            align={'center'}>
                    No profile found, please login again
                </Typography>
                <div className={classes.buttons}>
                    <Button variant={'contained'}
                            color={'primary'}
                            component={Link}
                            to={'/login'}>
                        Login
                    </Button>
                    <Button variant={'contained'}
                            color={'secondary'}
                            component={Link}
                            to={'/signup'}>
                        Sign Up
                    </Button>
                </div>
            </Paper>
        )) : <ProfileSkeleton/>;
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    uploadImage,
    logoutUser
};

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));