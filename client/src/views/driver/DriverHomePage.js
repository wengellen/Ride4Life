import React, { Component } from "react";
import { connect } from "react-redux";
import Map from "../map/CustomMap";
import {
  findDriversNearby,
  getDriversById,
  updateDriverLocation, updateRiderLocation,
} from "../../actions";

class DriverHomePage extends Component {
  constructor() {
    super();
    this.inst = "";
  }
  state = {
    location: {
      coordinates: [77.612257, 12.934729]
    },
    
    showEstimate: false,
    showDriver: false,
    enRoute: false
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log("position", position);
      
      this.setState({
        location: [position.coords.longitude, position.coords.latitude]
      });
      this.props.updateDriverLocation({
        coordinates: [position.coords.longitude, position.coords.latitude]
      })
      .then(res => {
        console.log('updateRiderLocation',updateRiderLocation)
      });
  
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
    // console.log('e',e)
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
