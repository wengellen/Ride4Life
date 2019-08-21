import React, { Component } from 'react';
import '../App.css';
import * as HomeImage from 'assets/img/homepage-2.jpg'

class HomePage extends Component {
    onRequestRide = () => {
    	this.props.history.push('/rider-login')
    }
    
    render() {
    return (
      <div>
            <div className={"home-page-image-holder"}>
              <img src={HomeImage} style={{maxWidth:"100%"}}/>
            </div>
            <main className={"app-content"}>
                <h1>Welcome to Ride for life</h1>
                <p>A RideSharing service for soon-to-be mothers <br/><em>Quote, Choose, and Ride</em></p>
                <button onClick={()=> this.onRequestRide()}>Request Ride</button>
            </main>
      </div>
    );
  }
}

export default HomePage
