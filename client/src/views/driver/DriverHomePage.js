import React, { Component } from "react";
import { connect } from "react-redux";
import Map from "../map/CustomMap";
import {
  findDriversNearby,
  getDriversById,
  updateDriverLocation,
} from "../../actions";
import socketIOClient from "socket.io-client";

class DriverHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {
                coordinates: [77.612257, 12.934729]
            },
            response: false,
            showEstimate: false,
            showDriver: false,
            enRoute: false,
            requestDetails:{},
            endpoint: "http://127.0.0.1:7000",
        };
        this.socket = socketIOClient(this.state.endpoint);
    }


  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'))
    let  coordinates
     navigator.geolocation.getCurrentPosition(position => {
         coordinates = [position.coords.longitude, position.coords.latitude]
          console.log("position", position);
          this.socket = socketIOClient(this.state.endpoint);
          this.socket.emit('UPDATE_DRIVER_LOCATION',
          {
                coordinates,
                 role: "driver",
                 username:user.username,
                 user:user,
                 
              }
          )
          this.socket.on('REQUEST_TRIP', (data) => {
             const requestDetails = data
             this.setState({requestDetails:data}) //Save request details
        
             //display citizen info
            console.log("You have a new request! \n" + JSON.stringify(requestDetails))
        
             //Show citizen location on the map
             // L.marker([requestDetails.location.latitude, requestDetails.location.longitude], {
             //     icon: L.icon({
             //         iconUrl: '/images/citizen.png',
             //         iconSize: [50, 50]
             //     })
             // }).addTo(map);
        
         });
          
          this.setState({
            location: [position.coords.longitude, position.coords.latitude]
          });
          // this.props.updateDriverLocation({
          //     coordinates
          // })
          // .then(res => {
          // });
  
    })

  
    const tripRequest = JSON.parse(localStorage.getItem("tripRequest"));
    if (tripRequest && tripRequest.startLocation) {
      const trip = {
        startLocation: tripRequest.startLocation,
        endLocation: tripRequest.endLocation
      };

      // localStorage.setItem('tripRequest',   JSON.stringify(tripRequest))
      this.props.findDriversNearby(trip).then(res => {
        this.setState({ showDriver: !this.state.showDriver });
      });
    }
    // 	this.setState({
    // 		startLocation:tripRequest.startLocation,
    // 		endLocation:tripRequest.endLocation,
    // 		enRoute:true
    // 	})
    // }
  }


  handleChange = e => {
    this.setState({
      [e.currentTarget.name]: {
        address: e.currentTarget.value
      }
    });
  };

  loadDriverProfile = driver => {
    // console.log('login clicked')
    this.props.getDriversById(driver.driver_id).then(() => {
      this.props.history.push(`/drivers/${driver.driver_id}`);
    });
  };

  findDriversNearby = e => {
    e.preventDefault();
    const tripRequest = {
      startLocation: this.state.startLocation,
      endLocation: this.state.endLocation
    };

    localStorage.setItem("tripRequest", JSON.stringify(tripRequest));
    this.props.findDriversNearby(tripRequest).then(res => {
      this.setState({ showDriver: !this.state.showDriver });
    });
  };

  cancelTrip = () => {
    console.log("cancelling trips");
  };

  render() {
    return (
      <div className="map-wrapper ">
        <div
          id="map-instructions"
          name="instruction"
          ref={instruction => (this.inst = instruction)}
        >
          <form>
            <div className="map-instructions-location">
              <h1>Welcome Driver. </h1>
              <h2> We are search for rides for you...</h2>
            </div>
          </form>
        </div>
        <div className="map-container">
          <Map zoom={16} center={{ lat: 39.74739, lng: -105 }} />
        </div>

        <div className="drivers-container">
          {this.props.driversNearby &&
            this.props.driversNearby.map((driver, idx) => {
              return (
                <div
                  className="driver-item-container"
                  key={idx}
                  onClick={e => this.loadDriverProfile(driver)}
                >
                  <div className="driver-img-container">
                    <img src="http://lorempixel.com/500/500" alt={"driver"}/>
                  </div>
                  <div className="driver-item-content">
                    <h2>{driver.username}</h2>
                    <h3>
                      2 mi
                      <span>{`, ${driver.earnedRatings} stars`}</span>
                    </h3>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ riderReducer, tripReducer }) => ({
  findNearbyDriverStarted: riderReducer.findNearbyDriverStarted,
  driversNearby: riderReducer.driversNearby,
  submitDriverReviewSuccessMessage:
    riderReducer.submitDriverReviewSuccessMessage
});

export default connect(
  mapStateToProps,
  { findDriversNearby, getDriversById, updateDriverLocation }
)(DriverHomePage);
