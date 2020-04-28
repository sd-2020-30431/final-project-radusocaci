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
import {likeScream, unlikeScream} from '../redux/actions/dataActions';
import CustomButton from '../util/CustomButton';
import {Chat, Favorite, FavoriteBorder} from '@material-ui/icons';
import DeleteScream from './DeleteScream';

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
    isScreamLiked = () => {
        return this.props.user.likes
            && this.props.user.likes.find(like => like.screamId === this.props.scream.screamId);
    };

    likeScream = () => {
        this.props.likeScream(this.props.scream.screamId);
    };

    unlikeScream = () => {
        this.props.unlikeScream(this.props.scream.screamId);
    };

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
        const likeButton = !authenticated ? (
            <CustomButton tip={'like'}>
                <Link to={'/login'}>
                    <FavoriteBorder color={'primary'}/>
                </Link>
            </CustomButton>
        ) : (
            this.isScreamLiked() ? (
                <CustomButton tip={'Undo like'}
                              onClick={this.unlikeScream}>
                    <Favorite color={'primary'}/>
                </CustomButton>
            ) : (
                <CustomButton tip={'Like'}
                              onClick={this.likeScream}>
                    <FavoriteBorder color={'primary'}/>
                </CustomButton>
            )
        );
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
                                to={`/users/${userHandle}`}>{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant={'body2'}
                                color={'textSecondary'}>{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant={'body1'}>{body}</Typography>
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <CustomButton tip={'comments'}>
                        <Chat color={'primary'}/>
                    </CustomButton>
                    <span>{commentCount} Comments</span>
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
    likeScream,
    unlikeScream
};

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    scream: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Scream));