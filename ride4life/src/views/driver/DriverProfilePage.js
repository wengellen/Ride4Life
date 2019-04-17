import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PinkButton from "../../components/Button/PinkButton";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Chat from "@material-ui/icons/Chat";
import Share from "@material-ui/icons/Share";
import Edit from "@material-ui/icons/Edit";
import Loader from 'react-loader-spinner'

import {
findDriversNearby,
getDriversById,
sendTripRequest,
updateProfile
} from '../../actions';

class DriverProfilePage extends Component {
	state = {
		isEditing: false,
		activeId: null,
		isDirty: true,
		profileBody: "I am trained in defensive driving and drive the ambulances. I hope to help you by providing a fair price and responding quickly.",
		driver:null
	}
	
	editProfile = ()=>{
		console.log('isEditing')
		this.setState({isEditing: !this.state.isEditing})
	}
	
	changeHandler = (e) => {
		this.setState({
			profileBody: e.target.value
		})
	}
	
	updateProfile = () => {
		// this.props.updateProfile(this.state.profileBody)
	}
	
	
	editProfile = () => {
		// this.props.updateProfile(this.state.profileBody)
	}
	
	render() {
		console.log('this.props.findDriverByIdStarted',this.props.findDriverByIdStarted)
		console.log('this.props.currentDriver',this.props.currentDriver)
	   if(this.props.findDriverByIdStarted){
		   return (<Loader/>)
	   }else{
		   return (
			   <div className="driver-profile-container">
				   <Edit className="edit-btn-container" onClick={this.editProfile}/>
				   {/*</Link>*/}
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
						   <h2>{this.props.currentDriver.reviews && this.props.currentDriver.reviews.length}</h2>
						   <p>REVIEWS</p>
					   </div>
				   </div>
				   <main className="driver-profile-main">
					   <Edit className="edit-btn-container"
							 onClick={this.editProfile}/>
					   <header >
						   <div className="driver-profile-img-avatar">
							   <img src="http://lorempixel.com/100/100" />
						   </div>
						   <div className="title">
							   <h2>Martin Makuza</h2>
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
					   { this.props.currentDriver.reviews && this.props.currentDriver.reviews.map((item, idx) => (
						   <div className="review-container" key={idx}>
							   <h2>Rider {idx + 1}</h2>
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
				   })}
				
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
	
   console.log('riderReducer.currentDriver', riderReducer.currentDriver)
	return {
		findDriverByIdStarted: riderReducer.findDriverByIdStarted,
		currentDriver:riderReducer.currentDriver,
	    // driversNearby: riderReducer.driversNearby,
	}
}

export default connect(
	mapStateToProps,
	{updateProfile }
)(DriverProfilePage);
