import React from "react";
import mapboxgl, {GeolocateControl} from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "mapbox-gl/dist/mapbox-gl.css"; // Updating node module will keep css up to date.
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { FlyToInterpolator } from "react-map-gl"; // Updating node module will keep css up to date.

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default class DirectionMap extends React.Component {
  state = {
  	start:[],
  	end:[],
    viewport: {
      latitude: 0,
      longitude: 0,
      zoom: 15
    },
    searchResultLayer: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
		 console.log("position", position);
		 this.setState({
		 	start:[ position.coords.longitude, position.coords.latitude]
		 })
		  // this.handleViewportChange({
			//   longitude: position.coords.longitude,
			//   latitude: position.coords.latitude,
			//   zoom: 15,
			//   transitionInterpolator: new FlyToInterpolator(),
			//   transitionDuration: 1750
		  // });
	
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
			// directions.addWaypoint(0, [-0.07571203, 51.51424049]);
			// directions.addWaypoint(1, [-0.12416858, 51.50779757]);
			// directions.setDestination(this.state.end);
		})
   });

    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  resize = () => {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  // locateUser = () => {
  //   navigator.geolocation.getCurrentPosition(position => {
  //     console.log("position", position);
  //
  //     this.handleViewportChange({
  //       longitude: position.coords.longitude,
  //       latitude: position.coords.latitude,
  //       zoom: 15,
  //       transitionInterpolator: new FlyToInterpolator(),
  //       transitionDuration: 1750
  //     });
  //   });
  // };

  render() {
    return (
      <div className="map-wrapper">
        <div
          ref={el => (this.mapContainer = el)}
          className="map"
          style={{
            position: "absolute",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex"
          }}
        />
      </div>
    );
  }
}
