import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Scream from '../components/Scream';
import Profile from '../components/Profile';
import ScreamSkeleton from '../util/ScreamSkeleton';
import {getScreams} from '../redux/actions/dataActions';

class Home extends Component {

    componentDidMount() {
        this.props.getScreams();
    }

    render() {
        const {screams, loading} = this.props.data;
        let recentScreamsMarkup = !loading ? (
            screams.map(scream => <Scream key={scream.screamId}
                                          scream={scream}/>)
        ) : <ScreamSkeleton/>;

        return (
            <Grid container
                  spacing={10}>
                <Grid item
                      sm={8}
                      xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item
                      sm={4}
                      xs={12}>
                    <Profile/>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data
});

const mapActionsToProps = {
    getScreams
};

Home.propTypes = {
    data: PropTypes.object.isRequired,
    getScreams: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(Home);
