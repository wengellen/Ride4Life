import React from "react";
import mapboxgl, {GeolocateControl} from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "mapbox-gl/dist/mapbox-gl.css"; // Updating node module will keep css up to date.
// import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import "./DirectionMap.css";
import { FlyToInterpolator } from "react-map-gl";
import PinkButton from "../../components/Button/PinkButton"; // Updating node module will keep css up to date.
import Loader from 'react-loader-spinner'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default class DirectionMap extends React.Component {
  state = {
  	start:[],
  	end:[],
    latitude: 0,
    longitude: 0,
    zoom: 12.5,
    searchResultLayer: null,
    loadingMap:true
  };

  componentDidMount() {
		navigator.geolocation.getCurrentPosition(position => {
			 console.log("position", position);
			 this.setState({
				start:[ position.coords.longitude, position.coords.latitude],
				loadingMap:false
			 })
			const map = new mapboxgl.Map({
				container: this.mapContainer, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
				style: "mapbox://styles/mapbox/streets-v9",
				center: [position.coords.longitude, position.coords.latitude],
				zoom:15
			});
		
			let directions = new MapboxDirections({
				accessToken: mapboxgl.accessToken,
				unit: "metric",
				profile: "mapbox/cycling"
			});
		
			let geolocate = new mapboxgl.GeolocateControl({
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
		
			map.on('move', () => {
				const { lng, lat } = map.getCenter();
				this.setState({
					longitude: lng.toFixed(4),
					latitude: lat.toFixed(4),
					zoom: map.getZoom().toFixed(2)
				});
			})
		})
  }



  render() {
	  const {requstRide} = this.props
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
							 click={()=>requstRide()}
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
