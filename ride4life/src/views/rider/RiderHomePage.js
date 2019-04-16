import React, { Component } from 'react';
import PinkButton from "../../components/Button/PinkButton";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

class RiderHomePage extends Component {
	// componentDidMount() {
	// }
	
	render() {
		const Map = ReactMapboxGl({
			accessToken:'pk.eyJ1Ijoid2VuZ2VsbGVuIiwiYSI6ImNqdWhndGN5ZDB6dGQ0M28yaWFieXdjbnIifQ.4pzfTG3T5htldmfo1P5nfg'
		});
		return (
			<div className="App">
				{/*<header className="App-header">*/}
					{/*<h1>Rider Request Page</h1>*/}
				{/*</header>*/}
				<Map
					style="mapbox://styles/mapbox/streets-v9"
					containerStyle={{
						height: "100vh",
						width: "100vw"
					}}>
					<Layer
						type="symbol"
						id="marker"
						layout={{ "icon-image": "marker-15" }}>
						<Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
					</Layer>
				</Map>
				{/*<div id="instructions">*/}
					{/*<aside></aside>*/}
				{/*</div>*/}
				<div className="container">
					<PinkButton>Request Ride</PinkButton>
				</div>
			</div>
		);
	}
}

export default RiderHomePage;
