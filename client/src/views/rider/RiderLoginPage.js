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
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "../../assets/img/icons/arrow-back.svg";
import RiderIcon from '../../assets/img/icons/rider.svg'
import CarIcon from "../../assets/img/icons/car.svg";

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
	
	handleChange = e => {
		this.setState({
			isEditing:true,
			credentials: {
				...this.state.credentials,
				[e.target.name]: e.target.value
			}
		});
	};
	
	handleBack = () => {
		this.props.history.push('/');
	}
	
	login = e => {
		e.preventDefault();
		this.setState({
			isEditing:false,
		})
		this.props.login_rider(this.state.credentials)
		.then(res => {
			console.log(res)
			if(res && res.message){
				this.props.history.push('/rider/standby');
			}else{
				console.log('SERVER ERROR, PLEASE COME BACK LATER')
			}
		})}
	
	render() {
		const { classes } = this.props;
		return (
			<div className={"form-container"}>
				<IconButton
					color="inherit"
					aria-label="back"
					className={"back-arrow-button"}
					onClick={this.handleBack}
				>
					<img src={BackIcon}/>
				</IconButton>
					<GridContainer justify="center">
						<GridItem  >
								<form style={{margin:"60px 60px 60px 60px"}} onSubmit={this.login}>
									<div className={classes.cardHeadline} style={{marginBottom:0}}>
										<img src={RiderIcon} alt={"rider icon"} style={{
											height:'100px',
											marginBottom:'14px'
										}}/>
										<h1 className={classes.cardTitle}>Rider</h1>
										<h2 className={classes.cardSubhead}>Login</h2>
									</div>
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
										<button className={"green-btn full"} style={{background:"#858fc9", fontSize:"1.2rem"}} type="submit" >
											{this.props.loggingIn
											? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />
											: "Log in"
											}
										</button>
									</div>
									<div style={{
										display:"flex",
										justifyContent:'center',
										alignItems:'center',
										fontWeight:500,
										marginTop:'20px',
										color:"#aaa"}}>
										<h4 style={{marginRight:'1rem'}}>
											No Account?
										</h4>
										<Link
											to="/rider-signup">
											SIGN UP
										</Link>
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
