import React, { Component } from 'react';
import PinkButton from "../../components/Button/PinkButton";

class RiderHomePage extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Rider Request Page</h1>
				</header>
				<div id="map"></div>
				<div className="container">
					<PinkButton>Request Ride</PinkButton>
				</div>
			</div>
		);
	}
}

export default RiderHomePage;
