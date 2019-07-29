import React, { Component } from 'react';
import axios from 'axios';
import {
	MapWindow,
	ShowMarker,
	CloseX,
	PopupInfo,
	PopupImg,
	Link,
	PopContent,
} from '../map/MapWindowStyle';
import SeekerPin from '../../assets/img/map/SMarker.png';
import CompanyPin from '../../assets/img/map/EMarker.png';
import PinkButton from "../../components/Button/PinkButton";
import {connect} from 'react-redux'
import Map from '../map/CustomMap'
import {findDriversNearby, getDriversById, sendTripRequest} from "../../actions";
import MapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./RiderHomePage.css"
import GeolocateControl from "react-map-gl/dist/es6/components/geolocate-control";
import SearchableMap from "../map/SearchableMap";
import DirectionMap from "../map/DirectionMap";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const  geolocateStyle = {
		float: 'left',
		margin: '50px',
		padding: '10px'
	};


class RiderHomePage extends Component {
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
		enRoute: false,
		viewport: {
			latitude: 37.7577,
			longitude: -100,
			zoom: 3,
			width: '100%',
			height: '100%',
		},
		data: [],
		pin: null,
		filter: {
			seeker: true,
			company: true,
		},
	}
	
	mapRef = React.createRef();
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}
	
	
	componentDidMount() {
		window.addEventListener('resize', this.resize);
		// this.resize();
		// this.getMarkers();
	
		const tripRequest = JSON.parse(localStorage.getItem('tripRequest'))
		if(tripRequest && tripRequest.startLocation){
			const trip = {
				startLocation : tripRequest.startLocation,
				endLocation : tripRequest.endLocation,
			}
			
			this.props.findDriversNearby(trip)
			.then(res => {
				this.setState({showDriver: !this.state.showDriver})
			})
		}
	}
	
	componentDidUpdate(prevProps) {
		if (prevProps.location.pathname !== this.props.location.pathname) {
			this.getMarkers();
		}
	}
	
	resize = () => {
		this.handleViewportChange({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};
	
	
	handleViewportChange = viewport => {
		this.setState({
			viewport: { ...this.state.viewport, ...viewport },
		});
	};
	
	goToViewport = (longitude, latitude) => {
		console.log('hi');
		this.handleViewportChange({
			latitude,
			longitude,
			zoom: 11,
			transitionInterpolator: new FlyToInterpolator(),
			transitionDuration: 1750,
		});
	};
	
	
	// ==== Gets the markers from the server ====
	getMarkers = () => {
		axios
		.get('https://intense-stream-29923.herokuapp.com/api/markers')
		.then(response => {
			const markerArray = [];
			for (let mark in response.data) {
				markerArray.push(response.data[mark]);
			}
			this.setState({ data: markerArray });
		})
		.catch(err => console.log(err));
	};
	
	// ==== Filter feature for the markers ====
	markerShow = e => {
		if (e.target.name === 'seeker') {
			this.setState(prevState => {
				return {
					filter: {
						...this.state.filter,
						seeker: !prevState.filter.seeker,
					},
				};
			});
		} else if (e.target.name === 'company') {
			this.setState(prevState => {
				return {
					filter: {
						...this.state.filter,
						company: !prevState.filter.company,
					},
				};
			});
		}
	};
	
	// ==== Renders the markers to the map ====
	renderMarker = (mark, i) => {
		let { role } = mark.properties;
		let pin;
		if (role === 'seeker') {
			pin = SeekerPin;
		} else if (role === 'company') {
			pin = CompanyPin;
		}
		return (
			<Marker
				key={i}
				latitude={mark.geometry.coordinates[1]}
				longitude={mark.geometry.coordinates[0]}
				offsetTop={-40}
				offsetLeft={-15}
			>
				<ShowMarker
					className={role}
					src={pin}
					alt="Marker"
					onClick={() => {
						this.setState({ pin: mark });
					}}
					show={this.state.filter}
				/>
			</Marker>
		);
	};
	
	// ==== Renders the popup to the map ====
	renderPopup = () => {
		const { pin } = this.state;
		
		let fullName = '';
		let jobTitle, profilePicture, role, geometry, properties;
		
		if (!!pin) {
			properties = pin.properties;
			geometry = pin.geometry;
			profilePicture = properties.profilePicture;
			role = properties.role;
			
			// if (!!pin.properties.title.firstName) {
			// 	jobTitle = properties.jobTitle;
			//
			// 	fullName = `${title.firstName} ${title.lastName}`;
			// } else if (!!pin.properties.title.companyName) {
			// 	role = 'employer';
			//
			// 	fullName = title.companyName;
			// } else {
			// 	console.log('Not a seeker or company');
			// }
			//
			return (
				pin && (
					<Popup
						latitude={geometry.coordinates[1]}
						longitude={geometry.coordinates[0]}
						offsetTop={-30}
						offsetLeft={-3}
						closeButton={false}
						closeOnClick={false}
					>
						<CloseX onClick={() => this.setState({ pin: null })}>&#215;</CloseX>
						<PopupInfo>
							<div className="container">
								<PopupImg image={profilePicture} />
								<PopContent>
									<h4>{fullName}</h4>
									{jobTitle ? (
										<div className="jobTitle">
											<p>Job Title:</p> <p>{jobTitle}</p>
										</div>
									) : null}
								</PopContent>
							</div>
							<Link
								className="link"
								onClick={() => {
									this.props.history.push(`/${role}/${properties.uid}`);
								}}
							>
								Learn more
							</Link>
						</PopupInfo>
					</Popup>
				)
			);
		}
	};
	
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
	}

	
	render() {
		return (
			<div className="map-wrapper ">
				
				<div className="map-container">
					{/*<Map zoom={16} center={{ lat: 39.74739, lng: -105 }} />*/}
					<DirectionMap />
					<MapWindow>
					{/*	<div className="map-instructions"*/}
					{/*		 name="instruction" ref={instruction => this.inst = instruction}>*/}
					{/*		<form>*/}
					{/*			<div className="map-instructions-location">*/}
					{/*				<h3>Pickup Location</h3>*/}
					{/*				<input*/}
					{/*					type="text"*/}
					{/*					placeholder="Your Address"*/}
					{/*					name="startLocation"*/}
					{/*					onChange={this.handleChange}*/}
					{/*					value={this.state.startLocation && this.state.startLocation.address}/>*/}
					{/*			</div>*/}
					{/*			*/}
					{/*			<div className="map-instructions-location">*/}
					{/*				<h3>Destination Location</h3>*/}
					{/*				<input*/}
					{/*					type="text"*/}
					{/*					name="endLocation"*/}
					{/*					onChange={this.handleChange}*/}
					{/*					value={this.state.endLocation && this.state.endLocation.address}*/}
					{/*					placeholder="Hospital Name"/>*/}
					{/*			</div>*/}
					{/*			{ this.state.enRoute*/}
					{/*				?   <button className="brown-btn" onClick={this.cancelTrip}>Cancel Route</button>*/}
					{/*				: 	<PinkButton*/}
					{/*					className={`pink-btn ${this.state.enRoute ? "brown-btn" : ""}`}*/}
					{/*					type="submit"*/}
					{/*					onClick={this.findDriversNearby}>Request Ride</PinkButton>*/}
					{/*			}*/}
					{/*		</form>*/}
					{/*	</div>*/}
					{/*<SearchableMap/>*/}
					</MapWindow>
					{/*);*/}
				</div>
				<div className="drivers-nearby-container">
					{this.props.driversNearby && this.props.driversNearby.map((driver, idx) => {
						return <div className="driver-item-container" key={idx}
									onClick={e => this.loadDriverProfile(driver)}>
							<div className="driver-img-container">
								<img src="http://lorempixel.com/500/500" alt={"driver"}/>
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
