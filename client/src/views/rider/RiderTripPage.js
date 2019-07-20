import React, { createRef, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PinkButton from "../../components/Button/PinkButton";
import {connect} from 'react-redux'
import Map from '../map/CustomMap'
import {findDriversNearby, getDriversById, sendTripRequest} from "../../actions";

class RiderTripPage extends Component {
	constructor(){
		super()
		this.inst = ''
	}
	state = {
		startLocation: {
			"coordinates" : [
				77.612257,
				12.934729
			],
			"address" : "239 Harbor way San Francisco, CA"
		},
		endLocation : {
			"coordinates" : [
				77.612257,
				12.934729
			],
			"address" : ""
		},
		showEstimate:false,
		showDriver:false,
		enRoute: false
	}
	
	endTrip = ()=>{
		console.log("end trip")
		this.props.history.push('/driver/review')
	}
	
	componentDidMount() {
		const tripRequest = JSON.parse(localStorage.getItem('tripRequest'))
		if(tripRequest && tripRequest.endLocation){
			this.setState({
				startLocation:tripRequest.startLocation,
				endLocation:tripRequest.endLocation,
				enRoute:true
			})
		}
		window.setTimeout( this.endTrip, 8000)
	}
	
	
	handleChange = e => {
		// console.log('e',e)
		this.setState({
			 [e.currentTarget.name]: {
			 	address: e.currentTarget.value
			 }
		});
	};
	
	loadDriverProfile = (driver)=>{
		// console.log('login clicked')
		this.props.getDriversById(driver.driver_id).then(() => {
	    	this.props.history.push(`/drivers/${driver.driver_id}`);
		});
	}
	
	findDriversNearby = (e)=>{
		e.preventDefault()
		const tripRequest = {
			startLocation : this.state.startLocation,
			endLocation : this.state.endLocation,
	}
	
	   localStorage.setItem('tripRequest',   JSON.stringify(tripRequest))
		this.props.findDriversNearby(tripRequest)
			.then(res => {
			this.setState({showDriver: !this.state.showDriver})
			})
	}
	
	cancelTrip = ()=>{
		console.log('cancelling trips')
		this.props.history.push('/rider-home')
	}
	
	
	render() {
		return (
			<div className="map-wrapper ">
				<div id="map-instructions"
					 name="instruction" ref={instruction => this.inst = instruction}>
						<form>
							 <div className="map-instructions-location">
								 <h1 > Your driver is coming in 5 minutes</h1>
								
								 <h3>Pickup Location</h3>
								 <input
									 type="text"
									 placeholder="Your Address"
									 name="startLocation"
									 onChange={this.handleChange}
									 value={this.state.startLocation && this.state.startLocation.address}/>
							 </div>
							<div className="map-instructions-location">
								<h3>Destination Location</h3>
								<input
									type="text"
									name="endLocation"
									onChange={this.handleChange}
									value={this.state.endLocation && this.state.endLocation.address}
									placeholder="Hospital Name"/>
							</div>
						 	<button className="brown-btn" onClick={this.cancelTrip}>Cancel Route</button>
						 	{/*<button className="brown-btn" onClick={this.endTrip}>End Trip</button>*/}
					</form>
				</div>
				<div className="map-container">
					<Map zoom={16} center={{ lat: 39.74739, lng: -105 }} />
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
)(RiderTripPage);
