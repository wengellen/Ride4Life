import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import PinkButton from "../../components/Button/PinkButton";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Chat from "@material-ui/icons/Chat";
import Share from "@material-ui/icons/Share";

class DriverProfilePage extends Component {
	render() {
		return (
			<div className="driver-profile-container">
				<header className="App-header">
					<div className="driver-img-container">
						<img src="http://lorempixel.com/500/500"/>
					</div>
					<h1>Martin Makuza</h1>
					<h3>Nawandala, Uganda</h3>
				</header>
				<div>
					<div>125 <br/> RIDES</div>
					<div>150 <br/> PRICE</div>
					<div>39 <br/> REVIEWS</div>
				</div>
				<div className="container">
					<div>
						<div className="driver-img-container">
							<img src="http://lorempixel.com/100/100"/>
						</div>
						<h1>Martin Makuza</h1>
						<h4>Driving for 2 years</h4>
					</div>
					<p>
						I am trained in defensive driving and drive the ambulances.
						I hope to help you by providing a fair price and responding quickly.
					</p>
					
					<div>
						<Link>
							<Share/>
						</Link>
						<Link>
							<strong>39 </strong>
							<Chat/>
						</Link>
						<Link>
							<strong>125 </strong>
							<FavoriteBorder/>
						</Link>
					</div>
					
					<h3>MY AMBULANCE</h3>
					<div>
						<div className="car-img-container">
							<img src="http://lorempixel.com/400/200"/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DriverProfilePage;
