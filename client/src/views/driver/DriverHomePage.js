import React, { Component } from "react";
import { connect } from "react-redux";
import {
  findDriversNearby,
  getDriversById,
  updateDriverLocation,
} from "../../actions";
import DirectionMapDriver from "./DirectionMapDriver";

class DriverHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

  componentDidMount() {
  
  }

  render() {
    return (
      <div className="map-wrapper ">
          <div className="map-container">
              <DirectionMapDriver />
          </div>
      </div>
    );
  }
}

const mapStateToProps = ({ riderReducer, tripReducer }) => ({
  submitDriverReviewSuccessMessage:
    riderReducer.submitDriverReviewSuccessMessage
});

export default connect(
  mapStateToProps,
  { findDriversNearby, getDriversById, updateDriverLocation }
)(DriverHomePage);
