import React, { Component } from 'react';
import PinkButton from "../../components/Button/PinkButton";

class DriverHomePage extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Driver Home Page</h1>
				</header>
				<div id="map"></div>
				<div className="container">
					<PinkButton>Finding Rides...</PinkButton>
				</div>
			</div>
		);
	}
}

export default DriverHomePage;
