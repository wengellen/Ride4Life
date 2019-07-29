import "mapbox-gl/dist/mapbox-gl.css"
import "./SearchableMap.css"
import React, { Component } from 'react'
import MapGL, {GeolocateControl, FlyToInterpolator} from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import PinkButton from "../../components/Button/PinkButton";
import {MapWindow} from "./MapWindowStyle";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const geolocateStyle = {
	float: 'left',
	margin: '50px',
	padding: '10px'
};
// const geolocate = new mapboxgl.GeolocateControl(...)
// map.addControl(geolocate)
class SearchableMap extends Component {
	state = {
		viewport :{
			latitude: 0,
			longitude: 0,
			zoom: 15
		},
		searchResultLayer: null
	}
	mapRef = React.createRef()
	geolocateRef = React.createRef()
	
	componentDidMount() {
		window.addEventListener('resize', this.resize);
		this.resize();
		this.locateUser()
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}
	
	resize = () => {
		this.handleViewportChange({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};
	locateUser = () => {
		navigator.geolocation.getCurrentPosition(position => {
			console.log('position',position)
			
			this.handleViewportChange({
				longitude: position.coords.longitude,
				latitude: position.coords.latitude,
				zoom: 15,
				transitionInterpolator: new FlyToInterpolator(),
				transitionDuration: 1750,
			});
		});
	}
	
	handleViewportChange = viewport => {
		this.setState({
			viewport: { ...this.state.viewport, ...viewport }
		})
	}
	// if you are happy with Geocoder default settings, you can just use handleViewportChange directly
	handleGeocoderViewportChange = viewport => {
		const geocoderDefaultOverrides = { transitionDuration: 1000 };
		
		return this.handleViewportChange({
			...viewport,
			...geocoderDefaultOverrides
		});
	};
	
	handleOnResult = event => {
		this.setState({
			searchResultLayer: new GeoJsonLayer({
				id: "search-result",
				data: event.result.geometry,
				getFillColor: [255, 0, 0, 128],
				getRadius: 1000,
				pointRadiusMinPixels: 10,
				pointRadiusMaxPixels: 10
			})
		})
	}
	
	render(){
		const { viewport, searchResultLayer} = this.state
		return (
			<div style={{ height: '100vh'}}>
				<MapGL
					// onLoad={this.geolocate.trigger()}
					ref={this.mapRef}
					{...viewport}
					mapStyle="mapbox://styles/mapbox/streets-v9"
					width="100%"
					height="90%"
					onViewportChange={this.handleViewportChange}
					mapboxApiAccessToken={MAPBOX_TOKEN}
				>
				
					<Geocoder
						mapRef={this.mapRef}
						onResult={this.handleOnResult}
						onViewportChange={this.handleGeocoderViewportChange}
						mapboxApiAccessToken={MAPBOX_TOKEN}
						position='top-left'
						style={{padding:"100px"}}
					/>
					<GeolocateControl
						mapRef={this.mapRef}
						geolocate={console.log('geolocate')}
						style={geolocateStyle}
						positionOptions={{enableHighAccuracy: true}}
						trackUserLocation={true}
						showUserLocation={true}
					/>
				</MapGL>
				<DeckGL {...viewport} layers={[searchResultLayer]} />
			</div>
		)
	}
}

export default SearchableMap;
