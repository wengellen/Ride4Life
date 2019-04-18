import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PinkButton from "../../components/Button/PinkButton";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Chat from "@material-ui/icons/Chat";
import Share from "@material-ui/icons/Share";
import Edit from "@material-ui/icons/Edit";
import Loader from 'react-loader-spinner'
import  Rating  from 'material-ui-rating'

import {
	submitDriverReview
} from '../../actions';

class DriverReviewPage extends Component {
	state = {
		isEditing: true,
		activeId: null,
		isDirty: true,
		driver:null,
		review:{
			details:'',
			rating:0
		}
	}
	
	editProfile = ()=>{
		console.log('isEditing')
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
		console.log('Rated with value ',value)
	}
	
	submitDriverReview = (e) => {
		e.preventDefault()
		this.props.submitDriverReview(this.state.review)
	}
	
	render() {
		console.log('this.props.findDriverByIdStarted',this.props.findDriverByIdStarted)
	   if(this.props.findDriverByIdStarted){
		   return (<Loader/>)
	   }else{
		   console.log('this.props.currentDriver',this.props.currentDriver)
		   console.log('this.props.currentDriver.review',this.props.currentDriver.review)
		
		   return (
			   <div className="driver-review-container">
				   <Edit className="edit-btn-container" onClick={this.editProfile}/>
				   {/*</Link>*/}
				 
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
				   </main>
			   </div>
		   );
	   }
	}
	
}

const mapStateToProps = ({riderReducer}) => {
   console.log('riderReducer.currentDriver', riderReducer.currentDriver)
	return {
		submitDriverReviewStarted: riderReducer.submitDriverReviewStarted,
		currentDriver:riderReducer.currentDriver,
	    // driversNearby: riderReducer.driversNearby,
	}
}

export default connect(
	mapStateToProps,
	{submitDriverReview }
)(DriverReviewPage);
