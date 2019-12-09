import * as React from 'react'
import './index.css'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import HomePage from './views/HomePage'
import DriverLoginPage from './views/driver/DriverLoginPage'
import DriverSignupPage from './views/driver/DriverSignupPage'
import RiderLoginPage from './views/rider/RiderLoginPage'
import RiderSignupPage from './views/rider/RiderSignupPage'
import RiderTripReviewPage from './views/rider/RiderTripReviewPage'
import DriverTripReviewPage from './views/driver/DriverTripReviewPage'
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
import { ThemeProvider } from "emotion-theming";
import ModalContainer  from "./components/ModalContainer";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";


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
        console.log('openPanel', type)
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
            <ThemeProvider
                theme={{
                    colors: {
                        primary: "hotpink",
                        hover: "crimson",
                        header: "dimgray",
                        black:"#525c65",
                        buttonBg:"#78849E"
                    }
                }}
            >
                <div className="App" >
                    <Header
                        openPanel={this.openPanel}
                        logoutUser={this.logout}
                        fixed
                        history={this.props.history}
                        style={{color:'red'}}
                    />
                    <ModalContainer />
    
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
                            path="/rider/standby"
                            component={RiderHomePage}
                        />
                        <PrivateRoute
                            path="/rider/requesting"
                            component={RiderHomePage}
                        />
                        <PrivateRoute
                            path="/rider/drivers-found"
                            component={RiderHomePage}
                        />
                        <PrivateRoute
                            path="/rider/confirmed"
                            component={RiderHomePage}
                        />
                        <PrivateRoute
                            path="/rider/pickup-rider"
                            component={RiderHomePage}
                        />
                        <PrivateRoute
                            path="/rider/trip-started"
                            component={RiderHomePage}
                        />
                        
                        <PrivateRoute
                            path="/rider/trip-ended"
                            component={RiderHomePage}
                        />
                        
                        {/*RIDER*/}
                        <PrivateRoute
                            path="/rider/driver/:id"
                            component={DriverProfilePage}
                        />
    
                        <PrivateRoute
                            path="/rider/edit-profile"
                            component={RiderEditProfilePage}
                        />
    
                        <PrivateRoute
                            path="/driver/offline"
                            component={DriverHomePage}
                        />
                        <PrivateRoute
                            path="/driver/standby"
                            component={DriverHomePage}
                        />
                        <PrivateRoute
                            path="/driver/requestIncoming"
                            component={DriverHomePage}
                        />
                        <PrivateRoute
                            path="/driver/waitingForConfirmation"
                            component={DriverHomePage}
                        />
                        <PrivateRoute
                            path="/driver/confirmed"
                            component={DriverHomePage}
                        />
                        <PrivateRoute
                            path="/driver/pickup"
                            component={DriverHomePage}
                        />
                        <PrivateRoute
                            path="/driver/trip-started"
                            component={DriverHomePage}
                        />
                        <PrivateRoute
                            path="/driver/trip-ended"
                            component={DriverHomePage}
                        />
                        {/*<PrivateRoute*/}
                        {/*    path="/driver/trip-ended"*/}
                        {/*    component={DriverTripReviewPage}*/}
                        {/*/>*/}
                    </Switch>
                </div>
            </ThemeProvider>
     
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
