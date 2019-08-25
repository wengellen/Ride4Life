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
import RiderTripPage from './views/rider/RiderTripPage'
import './App.css'
import SelectRolePanel from './views/SelectRolePanel'
import { logoutUser } from './actions'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            // user: null,
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
		const user = JSON.parse(localStorage.getItem('user'))
	
        console.log('this.props', this.props)
        return (
            <div className="App">
                <Header
                    openPanel={this.openPanel}
                    logoutUser={this.logout}
                    user={user}
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

                    <Route
                        path="/rider-home/standby"
                        component={RiderHomePage}
                    />
                    <Route
                        path="/rider-home/requesting"
                        component={RiderHomePage}
                    />
                    <Route
                        path="/rider-home/driversFound"
                        component={RiderHomePage}
                    />
                    <Route
                        path="/rider-home/confirmed"
                        component={RiderHomePage}
                    />
                    <Route
                        path="/rider-home/driver/:id"
                        component={RiderHomePage}
                    />
                    <Route path="/rider/:id/trip" component={RiderTripPage} />

                    <Route
                        path="/driver-home/offline"
                        component={DriverHomePage}
                    />
                    <Route
                        path="/driver-home/standby"
                        component={DriverHomePage}
                    />
                    <Route
                        path="/driver-home/requestIncoming"
                        component={DriverHomePage}
                    />
                    <Route
                        path="/driver-home/waitingForConfirmation"
                        component={DriverHomePage}
                    />
                    <Route
                        path="/driver-home/confirmed"
                        component={DriverHomePage}
                    />
                    <Route
                        path="/driver-home/pickup"
                        component={DriverHomePage}
                    />
                    <Route path="/drivers/:id" component={DriverProfilePage} />
                    <Route path="/driver/review" component={DriverReviewPage} />
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = ({ riderReducer, driverReducer }) => {
    // console.log('riderReducer.loggedInUser', riderReducer)
    return {
        // user: riderReducer.user || driverReducer.user,
    }
}

export default connect(
    mapStateToProps,
    { logoutUser }
)(withRouter(App))
