import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import PinkButton from "../../components/Button/PinkButton";
// import Edit from "@material-ui/icons/Edit";
import Loader from 'react-loader-spinner'
import  Rating  from 'material-ui-rating'

import {
	submitDriverReview
} from '../../actions';

class DriverReviewPage extends Component {
	state = {
		isEditing: true,
		driver:null,
		review:{
			details:'',
			rating:0
		},
	}
	
	editProfile = ()=>{
		// console.log('isEditing')
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
	
	componentWillUnmount() {
		// this.props = {}
	}
	
	
	submitDriverReview = (e) => {
		e.preventDefault()
		// console.log('submitDriverReview ',this.state.review)
		this.props.submitDriverReview(this.state.review,this.props.currentDriver.driver_id)
		.then(msg=>{
			this.props.history.push('/rider-home')
		})
	}
	
	render() {
		// console.log('this.props.findDriverByIdStarted',this.props.submitDriverReviewStarted)
	   if(this.props.submitDriverReviewStarted){
		   return (<Loader/>)
	   }else{
		   return (
			   <div className="driver-review-container">
				   {/*<Edit className="edit-btn-container" onClick={this.editProfile}/>*/}
				 
				   <main className="driver-profile-main review">
						   <div className="driver-profile-img-container ">
							   <img src="http://lorempixel.com/500/500" className="round"/>
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
							   <Rating
								   value={3}
								   max={5}
								   onChange={e=> this.rateDriver(e)}
							   />
						   </div>
					   <PinkButton onClick={this.submitDriverReview}>Submit Rating</PinkButton>
					   <h2>{this.props.submitDriverReviewSuccessMessage}</h2>
				   </main>
			   </div>
		   );
	   }
	}
	
}

const mapStateToProps = ({riderReducer}) => {
	return {
		submitDriverReviewStarted: riderReducer.submitDriverReviewStarted,
		currentDriver:riderReducer.currentDriver,
		submitDriverReviewSuccessMessage:riderReducer.submitDriverReviewSuccessMessage
	}
}

export default connect(
	mapStateToProps,
	{submitDriverReview }
)(DriverReviewPage);
