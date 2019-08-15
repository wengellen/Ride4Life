import React, { Component } from 'react';
import {connect} from 'react-redux'
import 'mapbox-gl/dist/mapbox-gl.css';
import "./RiderHomePage.css"
import DirectionMap from "../map/DirectionMap";
import StatusPanel from "../../components/Panel/StatusPanel";

class RiderHomePage extends Component {
	state = {
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.resize);
	}
	
	
	cancelTrip = ()=>{
		console.log('cancelling trips')
	}
	
	render() {
		return (
			<div className="map-container ">
				{/*<div className="map-container">*/}
					 <DirectionMap history={this.props.history}/>
				{/*</div>*/}
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
