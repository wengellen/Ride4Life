import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Chat from "@material-ui/icons/Chat";
import Share from "@material-ui/icons/Share";
import Edit from "@material-ui/icons/Edit";
import Loader from 'react-loader-spinner'
import Clear from  "@material-ui/icons/Clear";
import placeholder from 'assets/img/placeholder.jpg'
import {
	getDriversById,
} from '../../actions';
import {Avatar} from "@material-ui/core";

class DriverProfilePage extends Component {
	state = {
	}
	
	componentWillMount() {
		this.props.getDriversById(this.props.match.params.id).then((res) => {
			console.log('res',res)
		})
	}
	
	changeHandler = (e) => {
		this.setState({
			profileBody: e.target.value
		})
	}
	
	handleClose = () => {
		let backUrl = this.props.location.state ? this.props.location.state.prevPath : '/rider-home/standby'
		this.props.history.push(backUrl)
	}
	
	render() {
		const {currentDriver, findDriverByIdStarted} = this.props
		console.log('currentDriver', currentDriver)
	   if(!currentDriver){
		   return (<Loader/>)
	   }else{
		   return (
			   <div className="driver-profile-container">
				   <Link className='close-create-contact' to='/'>Close</Link>
				   <header>
					   <div className="driver-profile-img-container ">
						   <img src={currentDriver.avatar} className="round" alt={"driver avatar"}/>
					   </div>
					   <h1>{currentDriver.username}</h1>
					   <h3>{currentDriver.city}</h3>
				   </header>
				   <div className="stats-container">
					   <div>
						   <h2>{currentDriver.tripCompleted}</h2>
						   <p>RIDES</p>
					   </div>
					   <div>
						   <h2>{currentDriver.rating}</h2>
						   <p>RATING</p>
					   </div>
					   <div>
						   <h2>{currentDriver.review && currentDriver.review.length > 0 ? currentDriver.review.length : 0 }</h2>
						   <p>REVIEWS</p>
					   </div>
				   </div>
				
				   <main className="driver-profile-main">
					   <Edit className="edit-btn-container"
							 onClick={this.editProfile}/>
					   <header >
						   <div className="driver-profile-img-avatar">
							   <Avatar src={currentDriver.avatar||  placeholder}  alt={"driver"} />
						   </div>
						   <div className="title">
							   <h2>{currentDriver.username}</h2>
							   <h5>Driving for {currentDriver.createdAt} years</h5>
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
							   { item.username === JSON.parse(localStorage.getItem('user')).username
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
				
				   <div className="cars-container"  style={{padding:"4px 0"}}>
					   <h3>MY VEHICLE</h3>
					   <div className="car-img-container">
						   <img src={currentDriver.vehicle}  style={{width:"100%"}} alt="car"/>
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

export default withRouter(connect(
	mapStateToProps,
	{
	 getDriversById}
)(DriverProfilePage));
