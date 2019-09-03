import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import { login_rider } from '../../actions';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import withStyles from "@material-ui/core/styles/withStyles";
import Face from "@material-ui/icons/Face";
import CustomInput from "../../components/CustomInput/CustomInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Lock from "@material-ui/icons/Lock";
import {Link} from "react-router-dom";
import loginPageStyle from "assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";
// import SearchableMap from "../map/SearchableMap";
class RiderLoginPage extends React.Component {
	state = {
		credentials: {
			username: '',
			password: '',
		},
		isEditing: false,
		user:null
	};
	unsubscribeFromAuth = null;
	
	handleChange = e => {
		this.setState({
			isEditing:true,
			credentials: {
				...this.state.credentials,
				[e.target.name]: e.target.value
			}
		});
	};
	
	login = e => {
		e.preventDefault();
		this.setState({
			isEditing:false,
		})
		this.props.login_rider(this.state.credentials)
		.then(res => {
			if(res && res.message){
				this.props.history.push('/rider-home/standby');
			}else{
				console.log('SERVER ERROR, PLEASE COME BACK LATER')
			}
		})}
	
	render() {
		const { classes } = this.props;
		return (
				<div className={classes.container}>
					<GridContainer justify="center">
						<GridItem xs={12} sm={12} md={4}>
								<form className={classes.form} onSubmit={this.login}>
									<div className={classes.cardHeadline}>
										<h1 className={classes.cardTitle}>Rider</h1>
										<h2 className={classes.cardSubhead}>Login</h2>
									</div>
									<h4 className={classes.cardSubtitle}>No Account?
										<Link
											to="/rider-signup">
											Sign Up
										</Link>
									</h4>
									<p
										className={`${classes.description} ${classes.textCenter}`}
									>
									</p>
									<div>
										<CustomInput
											id="username"
											formControlProps={{
												fullWidth: true
											}}
											inputProps={{
												placeholder: "username",
												type: "text",
												onChange:this.handleChange,
												value:this.state.credentials.username,
												name:'username',
												startAdornment: (
													<InputAdornment position="start">
														<Face className={classes.inputIconsColor} />
													</InputAdornment>
												)
											}}
										/>
										<CustomInput
											id="pass"
											formControlProps={{
												fullWidth: true
											}}
											inputProps={{
												onChange:this.handleChange,
												value:this.state.credentials.password,
												name:'password',
												placeholder: "Password",
												type: "password",
												startAdornment: (
													<InputAdornment position="start">
														<Lock className={classes.inputIconsColor}/>
													</InputAdornment>
												)
											}}
										/>
									</div>
									<div className={classes.textCenter}>
										<button className={"green-btn full"} type="submit" >
											{this.props.loggingIn
											? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />
											: "Log in"
											}
										</button>
									</div>
								</form>
						</GridItem>
					</GridContainer>
					<div>
						<h2 className={`${classes.description} ${classes.textCenter}`}>
							{!this.state.isEditing && this.props.serverMessage}
						</h2>
					</div>
				</div>
		);
	}
}
const mapStateToProps = ({riderReducer}) => (
	{
		riderLoginStarted:riderReducer.riderLoginStarted,
		serverMessage:riderReducer.serverMessage
		
	}
)

export default connect(
	mapStateToProps,
	{ login_rider }
)(withStyles(loginPageStyle)(RiderLoginPage));
