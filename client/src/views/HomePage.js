import React, { Component } from 'react';
import '../App.css';
import * as HomeImage from 'assets/img/homepage.jpg'

class HomePage extends Component {
    onRequestRide = () => {
    	this.props.history.push('/rider-login')
    }
    
    render() {
    return (
      <div className="App">
            <div style={{width:"100%"}}>
             <img src={HomeImage} style={{minWidth:"100%"}}/>
            </div>
            <main className={"app-content"}>
                <h1>Welcome to Ride for life</h1>
                <p>If you're offered a seat on a rocket ship, <br/> don't ask what seat, Just get on.</p>
                <button onClick={()=> this.onRequestRide()}>Request Ride</button>
            </main>
      </div>
    );
  }
}

export default HomePage
