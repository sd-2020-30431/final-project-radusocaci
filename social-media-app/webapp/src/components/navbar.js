import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import CustomButton from '../util/CustomButton';
import {Home} from '@material-ui/icons';
import PostScream from './PostScream';
import Notifications from './Notifications';

class Navbar extends Component {
    render() {
        const {authenticated} = this.props;
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <PostScream/>
                            <Link to={'/'}>
                                <CustomButton tip={'Home'}>
                                    <Home color={'primary'}/>
                                </CustomButton>
                            </Link>
                                <Notifications/>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button color="inherit"
                                    component={Link}
                                    to="/">Home</Button>
                            <Button color="inherit"
                                    component={Link}
                                    to="/login">Login</Button>
                            <Button color="inherit"
                                    component={Link}
                                    to="/signup">Sign Up</Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Navbar);