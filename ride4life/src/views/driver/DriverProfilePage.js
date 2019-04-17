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
		// driver: {
		// 	username:'',
		// 	phone: '',
		// 	email: ''
		// }
	}
	
	
	//
	// static getDerivedStateFromProps(nextProps, prevState){
	// 	// if(!nextProps.isEditing || !prevState.isDirty) return
	// 	console.log('driversNearby', nextProps.driversNearby)
	// 	if( nextProps.driversNearby && nextProps.driversNearby.length > 0){
	// 	// if(nextProps.match.params.id !==prevState.activeId){
	// 		console.log('match.id', nextProps.match.params.id)
	// 		console.log('driversNearby', nextProps.driversNearby)
	// 		console.log('currentDriver', nextProps.currentDriver)
	// 		const id = nextProps.match.params.id
	// 		// if(!nextProps.currentDriver){
	// 		// 	return null
	// 		// }
	// 		const driver = nextProps.driversNearby.find(el => el.driver_id === nextProps.match.params.id)
	// 		// const driver = nextProps.driversNearby.find(el => el.userId === nextProps.match.params.id)
	// 		console.log('driver', driver)
	// 		return {
	// 			driver:driver,
	// 			isDirty: false,
	// 			isEditing: nextProps.isEditing }
	// 	}
	// 	 return null;
	// }
	
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
	   if(this.props.findDriverByIdStarted){
		   return (<Loader/>)
	   }
	   
	   return (
			<div className="driver-profile-container">
				 <Edit className="edit-btn-container" onClick={this.editProfile}/>
				{/*</Link>*/}
				<header>
					<div className="driver-profile-img-container ">
						<img src="http://lorempixel.com/500/500" className="round"/>
					</div>
					<h1>{this.props.driver.username}</h1>
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
						<h2>{this.props.driver.reviews && this.props.driver.reviews.length}</h2>
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
								 // value={this.state.profileBody}
								 onChange={this.changeHandler}/>
								<button onClick={this.updateProfile}>Save Change</button>
							</form>
							: <p>
								{/*{this.state.profileBody}*/}
							</p>
						}
						{ this.props.driver.reviews.map((item, idx) => (
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

const mapStateToProps = ({riderReducer}) => {
	// if( riderReducer.driversNearby.length === 0) return
	// const driver = riderReducer.driversNearby.find(el => el.driver_id === this.props.match.params.id)
	
	// console.log('driver', driver)
	// console.log('this.props.match.params.id', this.props.match.params.id)
	// console.log('riderReducer.driversNearby', riderReducer.driversNearby)
	return {
		findDriverByIdStarted: riderReducer.findDriverByIdStarted,
		driver:riderReducer.currentDriver,
	    // driversNearby: riderReducer.driversNearby,
	}
}

export default connect(
	mapStateToProps,
	{updateProfile }
)(DriverProfilePage);
