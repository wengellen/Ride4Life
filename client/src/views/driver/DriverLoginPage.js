import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import { login_driver } from '../../actions';
import PinkButton from "../../components/Button/PinkButton";
import GridContainer from "../../components/Grid/GridContainer";
import Card from "../../components/Card/Card";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import Phone from "@material-ui/icons/Phone";
import CustomInput from "../../components/CustomInput/CustomInput";
import CardBody from "../../components/Card/CardBody";
import InputAdornment from "@material-ui/core/InputAdornment";
import Lock from "@material-ui/icons/Lock";
import {Link} from "react-router-dom";
import loginPageStyle from "../../assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";

class DriverLoginPage extends React.Component {
	state = {
		credentials: {
			phone: '',
			password: ''
		},
		isEditing: false
	};
	
	componentDidMount() {
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
	}
	
	handleChange = e => {
		this.setState({
			isEditing:true,
			credentials: {
				...this.state.credentials,
				[e.currentTarget.name]: e.currentTarget.value
			}
		});
	};
	
	login = e => {
		// console.log('login clicked')
		e.preventDefault();
		this.setState({
			isEditing:false,
		})
		this.props.login_driver(this.state.credentials)
		.then((res) => {
			console.log('res', res)
			if(!res.data){
				this.props.history.push('/driverProfile-home');
			}
		});
	};
	render() {
		const { classes } = this.props;
		return (
				<div className={classes.container}>
					<GridContainer justify="center">
						<GridItem xs={12} sm={12} md={4}>
							<Card>
								<form className={classes.form} onSubmit={this.login}>
									<CardHeader
										color="info"
										signup
										className={classes.cardHeader}
									>
										<h2 className={classes.cardTitle}>Driver Login</h2>
										<h4 className={classes.cardSubtitle}>No Account?
											<Link
												to="/driver-signup">
												Sign Up
											</Link>
										</h4>
									</CardHeader>
									<p
										className={`${classes.description} ${classes.textCenter}`}
									>
									</p>
									<CardBody signup>
										<CustomInput
											id="first"
											formControlProps={{
												fullWidth: true
											}}
											inputProps={{
												placeholder: "Phone",
												type: "phone",
												onChange:this.handleChange,
												value:this.state.credentials.phone,
												name:'phone',
												startAdornment: (
													<InputAdornment position="start">
														<Phone className={classes.inputIconsColor} />
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
									
									</CardBody>
									<div className={classes.textCenter}>
										<PinkButton type="submit" color="primary"  >
											{this.props.loggingIn
												? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />
												: "Log in"
											}
										</PinkButton>
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
const mapStateToProps = ({driverReducer}) => (
	{
		driverSignupStarted:driverReducer.driverSignupStarted,
		serverMessage:driverReducer.serverMessage
	}
)

export default connect(
	mapStateToProps,
	{ login_driver }
)(withStyles(loginPageStyle)(DriverLoginPage));
