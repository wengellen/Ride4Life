import React, { Component } from 'react';
import {connect} from 'react-redux'
import Rating from "../../components/Ratings/Rating";
import Loader from 'react-loader-spinner'
import {withRouter} from 'react-router-dom'
import {
	submitRiderReview,
	openModal,
	toggleResetTrip
} from '../../actions';
import {Button} from "@material-ui/core";

class DriverTripReviewPage extends Component {
	state = {
		isEditing: true,
		driver:null,
		review:{
			details:'',
			rating:5
		},
	}
	
	editProfile = ()=>{
		this.setState({isEditing: !this.state.isEditing})
	}
	
	changeHandler = (e) => {
		this.setState({
			...this.state,
			review: {
				...this.state.review,
				[e.target.name]: e.target.value
			}
		})
	}
	
	rateDriver = (value)=>{
		// console.log('Rated with value ',value)
		this.setState({
			...this.state,
			review:{
				...this.state.review,
				rating: value
			}
		})
	}
	
	submitDriverReview = (e) => {
		e.preventDefault()
		// const {driverId, riderId} = this.props.data
		console.log('requestDetails', this.props.data)
		// console.log('submitDriverReview.data ',this.props.data)
		this.props.submitRiderReview(this.state.review, this.props.data)
			.then(res => {
				this.props.openModal({shouldOpen:false})
				this.props.toggleResetTrip(true).then(()=>{
					this.props.history.push('/driver/standby')
				})
			})
	}
	
	handleClose = () => {
		console.log("handleClose")
		// this.props.openModal({shouldOpen:false})
		const requestDetails = this.props.requestDetails
		this.props.submitRiderReview(this.state.review, requestDetails)
		.then(res => {
			this.props.openModal({shouldOpen:false})
			this.props.toggleResetTrip(true).then(()=>{
				this.props.history.push('/driver/standby')
			})
		})
	}
	
	render() {
	   if(this.props.submitDriverReviewStarted){
		   return (<Loader/>)
	   }else{
		   return (
			   <div className="driver-review-container">
				   <main className="driver-profile-main review">
						   <div className="driver-profile-img-container ">
							   <img src="http://lorempixel.com/500/500" className="round" alt={"driver avatar"}/>
						   </div>
						   <h1>{this.props.currentDriver.username}</h1>
						   <h2>Nawandala, Uganda</h2>
						
						  <form className="form-review">
							 <textarea
								 value={this.state.review.details}
								 onChange={this.changeHandler}
								 name="details"
								 placeholder="Describe your trip"
								 />
						   </form>
						   <div className="leave-review">
							   <h1>Rate your Trip </h1>
							   {/*<Rating stars={5}/>*/}
							   <Rating
								   value={3}
								   max={5}
								   onChange={e=> this.rateDriver(e)}
							   />
						   </div>
					   <Button onClick={this.submitDriverReview}>Submit Rating</Button>
					   <h2>{this.props.submitDriverReviewSuccessMessage}</h2>
				   </main>
			   </div>
		   );
	   }
	}
	
}

const mapStateToProps = ({userReducer}) => {
	return {
		submitDriverReviewStarted: userReducer.submitDriverReviewStarted,
		currentDriver:userReducer.currentDriver,
		submitDriverReviewSuccessMessage:userReducer.submitDriverReviewSuccessMessage
	}
}

export default connect(
	mapStateToProps,
	{submitRiderReview, openModal, toggleResetTrip}
)(withRouter(DriverTripReviewPage));
