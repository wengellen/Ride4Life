import React, { createRef, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PinkButton from "../../components/Button/PinkButton";
import Map from './map/CustomMap'

const styles = {
	root: {
		background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
		borderRadius: 3,
		border: 0,
		color: 'white',
		height: 48,
		padding: '0 30px',
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		width: '100%'
	},
};

class RiderHomePage extends Component {
	setDestination = (e)=>{
		e.preventDefault()
		console.log('e',e)
	}

	render() {
		console.log('classes', classes)
		const { classes} = this.props;
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
							className={classes.root.width}
							type="submit"
							onClick={this.setDestination}>Request Ride</PinkButton>
					</form>
				</div>
				<div className="map-container">
					<Map zoom={16} center={{ lat: 39.74739, lng: -105 }} />
				</div>
				
			 </div>
		);
	}
}

export default withStyles(styles)(RiderHomePage);
