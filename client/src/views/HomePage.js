import React, { Component } from 'react';
import '../App.css';


class HomePage extends Component {
    onRequestRide = () => {
    	this.props.history.push('/rider-login')
    }
    
    
    render() {
        const {user} = this.props
        return (
          <div className={"home-page-container"}>
                <div className={"home-page-image-holder"}>
                    <h1>Welcome to <br/> Ride for life</h1>
                </div>
                <main className={"app-content"}>
                    <p>A RideSharing service for <br/>soon-to-be mothers <br/></p>
                    <button onClick={()=> this.onRequestRide()}>Request Ride</button>
                </main>
          </div>
        );
  }
}

export default HomePage
