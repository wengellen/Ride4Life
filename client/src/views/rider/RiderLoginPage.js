import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import { login_rider } from '../../actions';
import PinkButton from "../../components/Button/PinkButton";
import GridContainer from "../../components/Grid/GridContainer";
import Card from "../../components/Card/Card";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import Face from "@material-ui/icons/Face";
import CustomInput from "../../components/CustomInput/CustomInput";
import CardBody from "../../components/Card/CardBody";
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
			if(res.message){
				this.props.history.push('/rider-home');
			}
		})}
	
	render() {
		const { classes } = this.props;
		return (
				<div className={classes.container}>
					<GridContainer justify="center">
						<GridItem xs={12} sm={12} md={4}>
							<Card>
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
									{/*<button onClick={signInWithGoogle}>Sign In With Google</button>*/}
									<div className={classes.textCenter}>
										<button className={classes.submitBtn} type="submit" >
											{this.props.loggingIn
											? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />
											: "Log in"
											}
										</button>
									</div>
								</form>
							</Card>
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
