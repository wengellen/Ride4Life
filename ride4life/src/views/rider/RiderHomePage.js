import React, { createRef, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PinkButton from "../../components/Button/PinkButton";
import {connect} from 'react-redux'
import Map from './map/CustomMap'
import {findDriversNearby, getDriversById, sendTripRequest} from "../../actions";
import {Link} from "react-router-dom";

class RiderHomePage extends Component {
	constructor(){
		super()
		this.inst = ''
	}
	state = {
		location: {
		},
		showEstimate:false
	}
	
	
	componentDidMount() {
		this.props.findDriversNearby(this.state.location)
	}
	
	loadDriverProfile = (driver)=>{
		console.log('login clicked')
		this.props.getDriversById(driver.driver_id).then(() => {
	    	console.log('his.props.login(this.state.credentials).then')
	    	this.props.history.push(`/drivers/${driver.driver_id}`);
		});
	}
	
	//
	// findDriversNearby = (e)=>{
	// 	e.preventDefault()
	// 	this.props.findDriversNearby()
	// }
	
	
	getEstimatedFare = (e)=>{
		e.preventDefault()
		// this.props.sendTripRequest(this.state.location)
		// .then(res => {
			// e.target.toggle('show')
			this.setState({showEstimate: !this.state.showEstimate})
		// })
	}
	
	
	sendTripRequest = (e)=>{
		e.preventDefault()
		e.persist();
		console.log('e',this.inst)
		this.props.sendTripRequest(this.state.location)
			.then(res => {
				this.props.history.push('/driver/review')
				this.setState({showEstimate: !this.state.showEstimate})
			})
	}
	
	
	render() {
		console.log('inst', this.inst)
		console.log('driversNearby', this.props)
		return (
			<div className="map-wrapper ">
				<div id="map-instructions"
					 name="instruction" ref={instruction => this.inst = instruction}>
					<form>
						 <div className="map-instructions-location">
							 <h3>Pickup Location</h3>
							 <input
								 name="input-start-location"
								 type="text"
								 placeholder="Your Address"/>
						 </div>
						<div className="map-instructions-location">
							<p3>Destination Location</p3>
							{/*<h2>Your Address</h2>*/}
							<input
								name="input-end-location"
								type="text"
								placeholder="Hospital Name"/>
						</div>
						{/*<button className="brown-btn">equest Ride</button>*/}
						<PinkButton
							className="pink-btn"
							type="submit"
							onClick={this.getEstimatedFare}>Request Ride</PinkButton>
					</form>
				</div>
				<div className="map-container">
					<Map zoom={16} center={{ lat: 39.74739, lng: -105 }} />
				</div>
				<main className={`trip-estimate-container ${this.state.showEstimate ? "slideup": ""}`} >
						<div className="trip-estimate-content">
							<p>Estimated Pickup Time: 4 Mins</p>
							<h2>$10</h2>
							<h1>Fare Estimate</h1>
						
						</div>
					<button className="brown-btn" onClick={this.sendTripRequest}>Send Requst</button>
				</main>
				
				<div className="drivers-container">
					{this.props.driversNearby && this.props.driversNearby.map((driver, idx) => {
						return <div className="driver-item-container" key={idx}
									 onClick={e => this.loadDriverProfile(driver)}>
									<div className="driver-img-container">
										<img src="http://lorempixel.com/500/500"/>
									</div>
									<div className="driver-item-content">
										<h2>{driver.username}</h2>
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
		driversNearby: riderReducer.driversNearby,
		submitDriverReviewSuccessMessage:riderReducer.submitDriverReviewSuccessMessage
	}
)

export default connect(
	mapStateToProps,
	{ findDriversNearby,
	  sendTripRequest,
	  getDriversById }
)(RiderHomePage);
