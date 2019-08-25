import React, { Component } from 'react';
import {connect} from 'react-redux'
import 'mapbox-gl/dist/mapbox-gl.css';
import "./RiderHomePage.css"
import DirectionMap from "./DirectionMap";

class RiderHomePage extends Component {
	state = {
	}
	
	componentWillUnmount() {
		// window.removeEventListener('resize', this.resize);
	}
	
	componentDidMount() {
		// window.addEventListener('resize', this.resize);
	}
	
	
	cancelTrip = ()=>{
		console.log('cancelling trips')
	}
	
	render() {
		return (
			<div className="map-container ">
				 <DirectionMap />
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
	{}
)(RiderHomePage);
