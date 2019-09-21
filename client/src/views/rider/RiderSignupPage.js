import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import { signup_rider } from '../../actions';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import withStyles from "@material-ui/core/styles/withStyles";
import Face from "@material-ui/icons/Face";
import CustomInput from "../../components/CustomInput/CustomInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Lock from "@material-ui/icons/Lock";
import Phone from "@material-ui/icons/Phone";
import Email from "@material-ui/icons/Email";
import {Link} from "react-router-dom";
import loginPageStyle from "assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";
import BackIcon from "../../assets/img/icons/arrow-back.svg";
import IconButton from "@material-ui/core/IconButton";

class RiderSignupPage extends React.Component {
    state = {
        profile: {
            email: '',
            username: '',
            password: '',
            phone:'',
        },
        isEditing: false
    };
    
    
    handleChange = e => {
        this.setState({
            isEditing:true,
            profile: {
                ...this.state.profile,
                [e.currentTarget.name]: e.currentTarget.value
            }
        });
    };
    
    handleBack = () => {
        this.props.history.push('/');
    }
    
    
    signup = e => {
        e.preventDefault()
        this.setState({
            isEditing:false,
        })
        this.props.signup_rider(this.state.profile)
        .then((res) => {
            console.log('res', res)
            if(!res.error){
                this.props.history.push('/rider-login');
                
            }
        });
    };
    
    
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
                    <GridItem>
                            <form style={{margin:"30px 60px 60px 60px"}} onSubmit={this.signup}>
                                <div className={classes.cardHeadline}>
                                    <h1 className={classes.cardTitle}>Rider</h1>
                                    <h2 className={classes.cardSubhead}>Sign Up</h2>
                                </div>
                                
                                <h4 className={classes.cardSubtitle}>Already Sign Up?
                                    < Link
                                        to="/rider-login">
                                        LOGIN
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
                                            placeholder: "Username",
                                            type: "username",
                                            onChange:this.handleChange,
                                            value:this.state.profile.username,
                                            name:'username',
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Face className={classes.inputIconsColor} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <CustomInput
                                        id="password"
                                        
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            placeholder: "Password",
                                            type: "password",
                                            onChange:this.handleChange,
                                            name:'password',
                                            value:this.state.profile.password,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock className={classes.inputIconsColor} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <CustomInput
                                        id="email"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            onChange:this.handleChange,
                                            value:this.state.profile.email,
                                            placeholder: "Email",
                                            name:'email',
                                            type: "text",
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email className={classes.inputIconsColor} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <CustomInput
                                        id="phone"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            placeholder: "Cell phone",
                                            type: "phone",
                                            onChange:this.handleChange,
                                            value:this.state.profile.phone,
                                            name:'phone',
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone className={classes.inputIconsColor} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                                <div className={classes.textCenter}>
                                    <button className={classes.submitBtn} type="submit" >
                                        {this.props.loggingIn
                                            ? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />
                                            : "SIGN UP"
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
        riderSignupStarted:riderReducer.riderSignupStarted,
        serverMessage:riderReducer.serverMessage
        
    }
)

export default connect(
    mapStateToProps,
    { signup_rider }
)(withStyles(loginPageStyle)(RiderSignupPage));
