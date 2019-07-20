import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Switch, Route, withRouter} from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import DriverLoginPage from "./views/driver/DriverLoginPage";
import DriverSignupPage from "./views/driver/DriverSignupPage";
import RiderLoginPage from "./views/rider/RiderLoginPage";
import RiderSignupPage from "./views/rider/RiderSignupPage";
import DriverReviewPage from "./views/driver/DriverReviewPage";
import RiderHomePage from "./views/rider/RiderHomePage";
import DriverHomePage from "./views/driver/DriverHomePage";
import DriverProfilePage from "./views/driver/DriverProfilePage";
import Header from "./components/Header/Header";
import RiderTripPage from "./views/rider/RiderTripPage";
import "./App.css"

const store = createStore(
	rootReducer,
	applyMiddleware(
		thunk,
		logger
	)
)

class App extends React.Component {
	state = {
		user:null
	};
	
	componentDidMount() {
	}
	
	componentWillUnmount =()=> {
		this.unsubscribeFromAuth()
	}
	
	render() {
		return (
			<div className="App">
				<Header />
				<Switch>
					<Route exact path="/" component={RiderLoginPage} />
					<Route path="/rider-login" component={RiderLoginPage} />
					<Route path="/rider-signup" component={RiderSignupPage} />
					<Route path="/driver-login" component={DriverLoginPage} />
					<Route path="/driver-signup" component={DriverSignupPage} />
					<Route path="/rider-home" component={RiderHomePage} />
					<Route path="/rider/:id/trip" component={RiderTripPage} />
					<Route path="/driver-home" component={DriverHomePage} />
					<Route path="/drivers/:id" component={DriverProfilePage} />
					<Route path="/driver/review" component={DriverReviewPage} />
				</Switch>
			</div>
		);
	}
}

const AppWithRouter = withRouter(App)


ReactDOM.render(
	<Provider store={store}>
		<Router>
			<AppWithRouter />
		</Router>
	</Provider>,
	document.getElementById('root')
);

// If you want your client to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
