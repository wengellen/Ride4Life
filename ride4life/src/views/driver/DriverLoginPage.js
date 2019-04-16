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
import loginPageStyle from "assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";
import Phone from "@material-ui/icons/Phone";
// import image from "assets/img/bg7.jpg";
import Button from "../../components/CustomButtons/Button";
import CustomInput from "../../components/CustomInput/CustomInput";
import CardBody from "../../components/Card/CardBody";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import Face from "@material-ui/icons/Face";
import {Link} from "react-router-dom";

class DriverLoginPage extends React.Component {
	state = {
		credentials: {
			phone: '6509522257',
			password: '0000'
		}
	};
	
	componentDidMount() {
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
	}
	
	handleChange = e => {
		this.setState({
			credentials: {
				...this.state.credentials,
				[e.target.name]: e.target.value
			}
		});
	};
	
	login = e => {
		console.log('login clicked')
		e.preventDefault();
		this.props.login_driver(this.state.credentials).then(() => {
			console.log('his.props.login(this.state.credentials).then')
		   this.props.history.push('/driver-home');
		});
	};
	styles = {
		marginBottom:"3rem"
	}
	
	render() {
		const { classes } = this.props;
		return (
			<div>
				<div className={this.styles.marginBottom}>
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
										<h4  className={classes.cardSubtitle}>No Account?
											<Link to="/driver-signup">
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
											id="phone"
											formControlProps={{
												fullWidth: true
											}}
											inputProps={{
												placeholder: "Phone",
												type: "text",
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
										<PinkButton type="submit" color="primary" >
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
				</div>
				
			</div>
		);
	}
}
const mapStateToProps = ({driverReducer}) => (
	{
		driverSignupStarted:driverReducer.driverSignupStarted
	}
)

export default connect(
	mapStateToProps,
	{ login_driver }
)(withStyles(loginPageStyle)(DriverLoginPage));
