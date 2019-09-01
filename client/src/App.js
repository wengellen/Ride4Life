import * as React from 'react'
import './index.css'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import HomePage from './views/HomePage'
import DriverLoginPage from './views/driver/DriverLoginPage'
import DriverSignupPage from './views/driver/DriverSignupPage'
import RiderLoginPage from './views/rider/RiderLoginPage'
import RiderSignupPage from './views/rider/RiderSignupPage'
import DriverReviewPage from './views/driver/DriverReviewPage'
import RiderHomePage from './views/rider/RiderHomePage'
import DriverHomePage from './views/driver/DriverHomePage'
import DriverProfilePage from './views/driver/DriverProfilePage'
import Header from './components/Header/Header'
import './App.css'
import SelectRolePanel from './components/SelectRolePanel'
import { logoutUser } from './actions'
import DriverEditProfilePage from './views/driver/DriverEditProfilePage'
import RiderEditProfilePage from './views/rider/RiderEditProfilePage'
import PrivateRoute from './components/PrivateRoute'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            user: null,
            showSlidingPanel: false,
            slidingPanelComponent: null,
        }
    }
    openPanel = type => {
        this.setState({
            showSlidingPanel: true,
            slidingPanelComponent: type,
        })
    }
    closePanel = () => {
        this.setState({
            showSlidingPanel: false,
        })
    }
    logout = () => {
        this.props.logoutUser()
    }
    render() {
        const { showSlidingPanel, slidingPanelComponent } = this.state
        const { user } = this.props

        return (
            <div className="App">
                <Header
                    openPanel={this.openPanel}
                    logoutUser={this.logout}
                    fixed
                    history={this.props.history}
                />
                <SelectRolePanel
                    show={showSlidingPanel}
                    type={slidingPanelComponent}
                    closePanel={this.closePanel}
                    history={this.props.history}
                />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/rider-login" component={RiderLoginPage} />
                    <Route path="/rider-signup" component={RiderSignupPage} />
                    <Route path="/driver-login" component={DriverLoginPage} />
                    <Route path="/driver-signup" component={DriverSignupPage} />

                    <PrivateRoute
                        path="/driver/edit-profile"
                        component={DriverEditProfilePage}
                    />
                    <PrivateRoute
                        path="/rider-home/standby"
                        component={RiderHomePage}
                    />
                    <PrivateRoute
                        path="/rider-home/requesting"
                        component={RiderHomePage}
                    />
                    <PrivateRoute
                        path="/rider-home/driversFound"
                        component={RiderHomePage}
                    />
                    <PrivateRoute
                        path="/rider-home/confirmed"
                        component={RiderHomePage}
                    />
                    <PrivateRoute
                        path="/rider-home/driver/:id"
                        component={DriverProfilePage}
                    />

                    <PrivateRoute
                        path="/rider/edit-profile"
                        component={RiderEditProfilePage}
                    />

                    <PrivateRoute
                        path="/driver-home/offline"
                        component={DriverHomePage}
                    />
                    <PrivateRoute
                        path="/driver-home/standby"
                        component={DriverHomePage}
                    />
                    <PrivateRoute
                        path="/driver-home/requestIncoming"
                        component={DriverHomePage}
                    />
                    <PrivateRoute
                        path="/driver-home/waitingForConfirmation"
                        component={DriverHomePage}
                    />
                    <PrivateRoute
                        path="/driver-home/confirmed"
                        component={DriverHomePage}
                    />
                    <PrivateRoute
                        path="/driver-home/pickup"
                        component={DriverHomePage}
                    />
                    <PrivateRoute
                        path="/drivers/:id"
                        component={DriverProfilePage}
                    />
                    <PrivateRoute
                        path="/driver/review"
                        component={DriverReviewPage}
                    />
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = ({ riderReducer, driverReducer }) => {
    return {
        user: riderReducer.user || driverReducer.user,
    }
}

export default connect(
    mapStateToProps,
    { logoutUser }
)(withRouter(App))
