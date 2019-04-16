import React, { createRef, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PinkButton from "../../components/Button/PinkButton";
import {connect} from 'react-redux'
import Map from './map/CustomMap'
import {findDriversNearby, getDriversById, sendTripRequest} from "../../actions";

class RiderHomePage extends Component {
	state = {
		location: {
		
		}
	}
	componentDidMount() {
		// this.props.findDriversNearby(this.state.location)
	}
	
	loadDriverProfile = (driver)=>{
		console.log('login clicked')
		this.props.getDriversById(driver.id).then(() => {
	    	console.log('his.props.login(this.state.credentials).then')
	    	this.props.history.push(`/drivers/${driver.id}`);
		});
	}
	
	//
	// findDriversNearby = (e)=>{
	// 	e.preventDefault()
	// 	this.props.findDriversNearby()
	// }
	
	sendTripRequest = (e)=>{
		e.preventDefault()
		console.log('e',e)
		this.props.sendTripRequest()
	}

	render() {
		console.log('driversNearby', this.props)
		return (
			<div className="map-wrapper">
				<div id="map-instructions">
					<form>
						 <h1>Where are you going</h1>
						<input
							name="input-start-location"
							type="text"
							placeholder="Start Location"/>
						<input
							name="input-end-location"
							type="text"
							placeholder="End Location"/>
						<PinkButton
							type="submit"
							onClick={this.sendTripRequest}>Request Ride</PinkButton>
					</form>
				</div>
				<div className="map-container">
					<Map zoom={16} center={{ lat: 39.74739, lng: -105 }} />
				</div>
				<div className="drivers-container">
					{this.props.driversNearby && this.props.driversNearby.map((driver, idx) => {
						return <div className="driver-item-container" key={idx}
									 onClick={e => this.loadDriverProfile(driver)}>
									<div className="driver-img-container">
										<img src="http://lorempixel.com/500/500"/>
									</div>
									<div className="driver-item-content">
										<h2>{driver.displayName}</h2>
										<h3>2 mi
											<span>{`, ${driver.earnedRatings} stars` }</span>
										</h3>
									</div>
								</div>
					})}
				</div>
				
			</div>
		);
	}
}

const mapStateToProps = ({riderReducer, tripReducer}) => (
	{
		findNearbyDriverStarted:riderReducer.findNearbyDriverStarted,
		driversNearby: riderReducer.driversNearby
	}
)

export default connect(
	mapStateToProps,
	{ findDriversNearby,
	  sendTripRequest,
	  getDriversById }
)(withStyles()(RiderHomePage));
