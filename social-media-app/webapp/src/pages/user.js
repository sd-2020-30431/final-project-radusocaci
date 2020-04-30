import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getUserData} from '../redux/actions/dataActions';
import {connect} from 'react-redux';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/Scream';
import StaticProfile from '../components/StaticProfile';
import ScreamSkeleton from '../util/ScreamSkeleton';

class User extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            profile: null,
            screamId: null
        };
    }

    componentDidMount() {
        const handle = this.props.match.params.handle;
        const screamId = this.props.match.params.screamId;
        if (screamId) {
            this.setState({
                screamId
            });
        }
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                });
            })
            .catch(err => console.error(err));
    }

    render() {
        const {
            screams,
            loading
        } = this.props.data;
        const screamId = this.state.screamId;
        const screamsMarkup = loading ? (
            <ScreamSkeleton/>
        ) : screams.length === 0 ? (
            <p>No screams from this user</p>
        ) : !screamId ? (
            screams.map(scream => <Scream key={scream.screamId}
                                          scream={scream}/>)
        ) : (
            screams.map(scream => {
                if (scream.screamId !== screamId) {
                    return <Scream key={scream.screamId}
                                   scream={scream}/>;
                } else {
                    return <Scream key={scream.screamId}
                            scream={scream}
                            openDialog/>;
                }
            })

        );
        return (
            <Grid container
                  spacing={10}>
                <Grid item
                      sm={8}
                      xs={12}>
                    {screamsMarkup}
                </Grid>
                <Grid item
                      sm={4}
                      xs={12}>
                    {this.state.profile ? <StaticProfile profile={this.state.profile}/> : <p>Loading...</p>}
                </Grid>
            </Grid>
        );
    }
}

User.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapActionsToProps = {
    getUserData
};

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, mapActionsToProps)(User);