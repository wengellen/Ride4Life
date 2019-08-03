import React, { Component } from 'react';
import {connect} from 'react-redux'
import {findDriversNearby, getDriversById, sendTripRequest} from "../../actions";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./RiderHomePage.css"
import DirectionMap from "../map/DirectionMap";
import PinkButton from "../../components/Button/PinkButton";

class RiderHomePage extends Component {
	state = {
		showEstimate:false,
		showDriver:false,
		data: [],
	}
	
	mapRef = React.createRef()
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.resize);
	
		const tripRequest = JSON.parse(localStorage.getItem('tripRequest'))
	}
	
	componentDidUpdate(prevProps) {
	}
	// loadDriverProfile = (driver)=>{
	// 	// console.log('login clicked')
	// 	this.props.getDriversById(driver.driver_id).then(() => {
	//     	this.props.history.push(`/drivers/${driver.driver_id}`);
	// 	});
	// }
	
	cancelTrip = ()=>{
		console.log('cancelling trips')
	}
	
	render() {
		return (
			<div className="map-wrapper ">
				<div className="map-container">
					 <DirectionMap/>
				</div>
			{/*	<div className="drivers-nearby-container">*/}
			{/*		{this.props.driversNearby && this.props.driversNearby.map((driver, idx) => {*/}
			{/*			return <div className="driver-item-container" key={idx}*/}
			{/*						onClick={e => this.loadDriverProfile(driver)}>*/}
			{/*				<div className="driver-img-container">*/}
			{/*					<img src="http://lorempixel.com/500/500" alt={"driver"}/>*/}
			{/*				</div>*/}
			{/*				<div className="driver-item-content">*/}
			{/*					<h2>{driver.username}</h2>*/}
			{/*					<h3>2 mi*/}
			{/*						<span>{`, ${driver.earnedRatings} stars` }</span>*/}
			{/*					</h3>*/}
			{/*				</div>*/}
			{/*			</div>*/}
			{/*		})}*/}
			{/*	</div>*/}
			</div>
		);
	}
}

const mapStateToProps = ({riderReducer, tripReducer}) => (
	{
		// findNearbyDriverStarted:riderReducer.findNearbyDriverStarted,
		// driversNearby: riderReducer.driversNearby,
		// submitDriverReviewSuccessMessage:riderReducer.submitDriverReviewSuccessMessage
	}
)

export default connect(
	mapStateToProps,
	{ findDriversNearby,
	  sendTripRequest,
	  getDriversById,
	  }
)(RiderHomePage);
