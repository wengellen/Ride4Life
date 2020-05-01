import React, { Component } from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Rating from "../../components/Ratings/Rating";
import Loader from 'react-loader-spinner'

import {
	submitDriverReview,
	openModal,
	toggleResetTrip
} from '../../actions';
import {Button} from "@material-ui/core";

class RiderTripReviewPage extends Component {
	state = {
		isEditing: true,
		driver:null,
		review:{
			details:'',
			rating:0
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
		// console.log('submitDriverReview ',this.state.review)
		this.props.submitDriverReview(this.state.review)
			.then(res => {
				this.props.openModal({shouldOpen:false})
				this.props.toggleResetTrip(true).then(()=>{
					this.props.history.push('/rider/standby')
				})
			})
	}
	
	handleClose = () => {
		// this.props.openModal({shouldOpen:false})
		this.props.submitDriverReview(this.state.review)
		.then(res => {
			this.props.openModal({shouldOpen:false})
			this.props.toggleResetTrip(true).then(()=>{
				this.props.history.push('/rider/standby')
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
								   value={0}
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
	{submitDriverReview, openModal, toggleResetTrip }
)(withRouter(RiderTripReviewPage));
