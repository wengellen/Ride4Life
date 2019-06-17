import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PinkButton from "../../components/Button/PinkButton";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Chat from "@material-ui/icons/Chat";
import Share from "@material-ui/icons/Share";
import Edit from "@material-ui/icons/Edit";
import Loader from 'react-loader-spinner'
import Clear from  "@material-ui/icons/Clear";

import {
 sendTripRequest,
} from '../../actions';

class DriverProfilePage extends Component {
	state = {
		isEditing: false,
		activeId: null,
		isDirty: true,
		showEstimate:false,
		profileBody: "I am trained in defensive driving and drive the ambulances. I hope to help you by providing a fair price and responding quickly.",
		driver:null,
		trip:{}
	}
	
	editProfile = ()=>{
		this.setState({isEditing: !this.state.isEditing})
	}
	
	changeHandler = (e) => {
		this.setState({
			profileBody: e.target.value
		})
	}
	
	
	getFareEstimate = (e)=>{
		e.preventDefault()
	   this.setState({showEstimate: !this.state.showEstimate})
	}
	
	sendTripRequest = (e)=>{
		e.preventDefault()
		const user =  JSON.parse(localStorage.getItem('loggedInUser'))
		const tripRequest =  JSON.parse(localStorage.getItem('tripRequest'))
		const trip = {
				trip_id:1,
				driver_id:2,
				requestTime : {date:"2016-10-31T12:12:37.321Z"},
			    tripInfo: tripRequest,
				status : "confirmed",
		}
		
		
		this.props.sendTripRequest(trip)
			.then(res => {
				this.props.history.push(`/rider/${user.rider_id}/trip`);
			})
	}
	
	render() {
	   if(this.props.findDriverByIdStarted){
		   return (<Loader/>)
	   }else{
		   return (
			   <div className="driver-profile-container">
				   <main className={`trip-estimate-container ${this.state.showEstimate ? "slideup": ""}`} >
					   <div className="trip-estimate-content">
						   <p>Estimated Pickup Time: 4 Mins</p>
						   <h2>$10</h2>
						   <h1>Fare Estimate</h1>
					   </div>
					   <PinkButton className="brown-btn" onClick={this.sendTripRequest}>Confirm Ride Request</PinkButton>
				   </main>
				   {/*<Edit className="edit-btn-container" onClick={this.editProfile}/>*/}
				   <header>
					   <div className="driver-profile-img-container ">
						   <img src="http://lorempixel.com/500/500" className="round"/>
					   </div>
					   <h1>{this.props.currentDriver.username}</h1>
					   <h3>Nawandala, Uganda</h3>
				   </header>
				   <div className="stats-container">
					   <div>
						   <h2>125</h2>
						   <p>RIDES</p>
					   </div>
					   <div>
						   <h2>150</h2>
						   <p>PRICE</p>
					   </div>
					   <div>
						   <h2>{this.props.currentDriver.review && this.props.currentDriver.review.length}</h2>
						   <p>REVIEWS</p>
					   </div>
				   </div>
				   <button className="brown-btn" onClick={this.getFareEstimate}>Get Price Estimate</button>
				
				   <main className="driver-profile-main">
					   <Edit className="edit-btn-container"
							 onClick={this.editProfile}/>
					   <header >
						   <div className="driver-profile-img-avatar">
							   <img src="http://lorempixel.com/100/100" />
						   </div>
						   <div className="title">
							   <h2>{this.props.currentDriver.username}</h2>
							   <h5>Driving for 2 years</h5>
						   </div>
					   </header>
					   {this.state.isEditing
						   ? <form>
							 <textarea
								 value={this.state.profileBody}
								 onChange={this.changeHandler}/>
							   <button onClick={this.updateProfile}>Save Change</button>
						   </form>
						   : <p>
							   {this.state.profileBody}
						   </p>
					   }
					   { this.props.currentDriver.review && this.props.currentDriver.review.map((item, idx) => (
						   <div className="review-container" key={idx}>
							   { item.username === JSON.parse(localStorage.getItem('loggedInUser')).username
							   	 ? <Clear/>
							   	 : null
							   }
							   <h2>{item.username}</h2>
							   <div className="star-container">
								   <h2>{item.rating} Stars</h2>
							   </div>
							   <p>{item.review}</p>
						   </div>
					   ))}
					   <div className="fav-button-bar">
						   <Link to="#" className="share">
							   <Share/>
						   </Link>
						   <Link to="#"  className="chat">
							   <strong>39 </strong>
							   <Chat/>
						   </Link>
						   <Link to="#"  className="fav">
							   <strong>125 </strong>
							   <FavoriteBorder/>
						   </Link>
					   </div>
				   </main>
				
				   <div className="cars-container">
					   <h3>MY AMBULANCE</h3>
					   <div className="car-img-container">
						   <img src="http://lorempixel.com/1400/1200"/>
					   </div>
				   </div>
			   </div>
		   );
	   }
	}
	
}

const mapStateToProps = ({riderReducer}) => {
	return {
		findDriverByIdStarted: riderReducer.findDriverByIdStarted,
		currentDriver:riderReducer.currentDriver,
	}
}

export default connect(
	mapStateToProps,
	{sendTripRequest}
)(DriverProfilePage);
