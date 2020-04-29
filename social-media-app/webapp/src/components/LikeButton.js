import React, {Component} from 'react';
import CustomButton from '../util/CustomButton';
import {Link} from 'react-router-dom';
import {Favorite, FavoriteBorder} from '@material-ui/icons';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {likeScream, unlikeScream} from '../redux/actions/dataActions';

class LikeButton extends Component {

    isScreamLiked = () => {
        return this.props.user.likes
            && this.props.user.likes.find(like => like.screamId === this.props.screamId);
    };

    likeScream = () => {
        this.props.likeScream(this.props.screamId);
    };

    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId);
    };

    render() {
        const {authenticated} = this.props.user;
        return !authenticated ? (
            <Link to={'/login'}>
                <CustomButton tip={'like'}>
                    <FavoriteBorder color={'primary'}/>
                </CustomButton>
            </Link>
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
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
    likeScream,
    unlikeScream
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);