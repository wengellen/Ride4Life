import React from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "mapbox-gl/dist/mapbox-gl.css"; // Updating node module will keep css up to date.
import "./DirectionMap.css";
import PinkButton from "../../components/Button/PinkButton"; // Updating node module will keep css up to date.
import Loader from 'react-loader-spinner'
import {connect} from "react-redux";
import {findDriversNearby, getDriversById, sendTripRequest} from "../../actions";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

class DirectionMap extends React.Component {
  state = {
	  startLocation:[],
  	  endLocation:[],
    latitude: 0,
    longitude: 0,
    zoom: 12.5,
    searchResultLayer: null,
    loadingMap:true
  };

  componentDidMount() {
	  let map, directions, geolocate
	  
	  navigator.geolocation.getCurrentPosition(position => {
			 console.log("position", position);
			 this.setState({
			    startLocation:[ position.coords.longitude, position.coords.latitude],
				loadingMap:false
			 })
			  map = new mapboxgl.Map({
				container: this.mapContainer, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
				style: "mapbox://styles/mapbox/streets-v9",
				center: [position.coords.longitude, position.coords.latitude],
				zoom:15
			});
		
			 directions = new MapboxDirections({
				accessToken: mapboxgl.accessToken,
				unit: "metric",
				profile: "mapbox/driving"
			});
			  directions.on('destination', (e) => {
				  this.setState({endLocation:e.feature.geometry.coordinates})
				  console.log(e); // Logs the current route shown in the interface.
			  })
			  
			  directions.on('route', function(e) {
				  console.log(e.route); // Logs the current route shown in the interface.
			  });
		    geolocate = new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
					watchPosition: true
				}
			});
		
			
			map.addControl(directions, "top-left");
			map.addControl(geolocate, "top-right");
		
			map.on('load',() => {
				directions.setOrigin([position.coords.longitude, position.coords.latitude]);
				
			})
			
			
			
		
			// map.on('move', () => {
			// 	const { lng, lat } = map.getCenter();
			// 	this.setState({
			// 		longitude: lng.toFixed(4),
			// 		latitude: lat.toFixed(4),
			// 		zoom: map.getZoom().toFixed(2)
			// 	});
			// })
		})
    }
	
	handleRequestRide = ()=>{
		const tripRequest = {
			startLocation : this.state.startLocation,
			endLocation : this.state.endLocation
		}
		
		// localStorage.setItem('tripRequest',   JSON.stringify(tripRequest))
		console.log('tripRequest', tripRequest)
		this.props.sendTripRequest(tripRequest)
		.then(res => {
			// this.setState({showDriver: !this.state.showDriver})
		})
	}
	
	
	handleUserLocated = (e) => {
	
	}
	
	
	render() {
     return (
		 this.state.loadingMap
				 ?  <div style={{
				 			 width:"100%", height:"100vh",
				 			 display:"flex",
				 			 flexDirection:"column",
				 			 justifyContent:"center",
			                 alignItems:"center",
				 			 backgroundColor:"rgba(0,0,0,0.9)"}}>
				 		<Loader type="ThreeDots" color="white" height="50" width="50" />
				 		<h3>Loading...</h3>
					 </div>
				 :   <div className="map-wrapper"
						  style={{position:"relative", display:"flex"}}>
						 <PinkButton
							 type="button"
							 onClick={()=>this.handleRequestRide()}
							 style={{
								 zIndex:"10",
								 bottom:"120px",
								 display:"block",
								 position: "absolute",
								 margin: "0px auto",
								 textAlign: "center",
								 color: "#fff",
								 background: "#ee8a65",
								 borderRadius:"50%",
								 width:"140px",
								 height:"140px",
								 fontWeight:"bold",
								 fontSize:"1.1rem",
								 border:"1px solid white",
								 boxShadow:"1px 1px 0 8px rgba(0,0,0,0.1)",
								 justifySelf:"center"
							 }}>Request Ride</PinkButton>
						 <div
							 ref={el => (this.mapContainer = el)}
							 className="map"
							 style={{
								 width:"100%",
								 height:"100%",
							 }}
						 >
						 </div>
					 </div>
	 		);
  }
}
const mapStateToProps = ({riderReducer, tripReducer}) => (
	{
	}
)

export default connect(
	mapStateToProps,
	{   findDriversNearby,
		sendTripRequest,
		getDriversById }
)(DirectionMap);
