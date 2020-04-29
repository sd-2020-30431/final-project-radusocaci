import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CustomButton from '../util/CustomButton';
import {Chat} from '@material-ui/icons';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
        position: 'relative'
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

class Scream extends Component {
    render() {
        dayjs.extend(relativeTime);
        const {
            classes,
            scream: {
                body,
                createdAt,
                userImage,
                userHandle,
                screamId,
                likeCount,
                commentCount
            },
            user: {
                authenticated,
                credentials: {
                    handle
                }
            }
        } = this.props;
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId}/>
        ) : null;
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image}
                           image={userImage}
                           title="Profile image"/>
                <CardContent className={classes.content}>
                    <Typography variant={'h5'}
                                color={'primary'}
                                component={Link}
                                to={`/users/${userHandle}`}>
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant={'body2'}
                                color={'textSecondary'}>
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant={'body1'}>
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} Likes</span>
                    <CustomButton tip={'comments'}>
                        <Chat color={'primary'}/>
                    </CustomButton>
                    <span>{commentCount} Comments</span>
                    <ScreamDialog screamId={screamId}
                                  userHandle={userHandle}/>
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(Scream));