import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import { signupUser } from '../../actions';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "../../assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";
import CustomInput from "../../components/CustomInput/CustomInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import Phone from "@material-ui/icons/Phone";
import Face from "@material-ui/icons/Face";
import Place from "@material-ui/icons/Place";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "../../assets/img/icons/arrow-back.svg";
import CarIcon from '../../assets/img/icons/car.svg'

class
DriverSingupPage extends React.Component {
  state = {
    profile: {
        email: '',
        username: '',
        password: '',
        phone:'',
        city:'',
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
            profile: {
                ...this.state.profile,
                [e.currentTarget.name]: e.currentTarget.value
            }
        });
    };
    handleBack = () => {
        this.props.history.push('/');
    }
    
    signupDriver = e => {
        console.log('signupDriver')
    
        e.preventDefault();
      this.setState({
          isEditing:false,
      })
    this.props.signupUser({user: this.state.profile, role:'driver'})
    .then((res) => {
        console.log('res', res)
        if(!res.data){
            this.props.history.push('/driver-login');
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
                  <img src={BackIcon} alt={"back icon"}/>
              </IconButton>
            <GridContainer justify="center">
              <GridItem >
                  <form style={{margin:"30px 60px 60px 60px"}} onSubmit={this.signupDriver}>
                      <div className={classes.cardHeadline}>
                          <img src={CarIcon} alt={"driver icon"} style={{
                              width:'130px',
                              marginBottom:'14px'
                          }}/>
                          <h1 className={classes.cardTitle}>Driver</h1>
                          <h2 className={classes.cardSubhead}>Sign Up</h2>
                      </div>
                    <div>
                      <CustomInput
                          id="first"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "Useraname",
                            type: "text",
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
                              value:this.state.profile.password,
                              name:'password',
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
                                fullWidth: true
                            }}
                            inputProps={{
                                placeholder: "Email...",
                                type: "email",
                                onChange:this.handleChange,
                                value:this.state.profile.email,
                                name:'email',
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
                      <CustomInput
                          id="city"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "city",
                            type: "option",
                              onChange:this.handleChange,
                              value:this.state.profile.city,
                              name:'city',
                            startAdornment: (
                                <InputAdornment position="start">
                                  <Place className={classes.inputIconsColor}/>
                                </InputAdornment>
                            )
                          }}
                      />
                    </div>
                    <div className={classes.textCenter}>
                        <button className={"green-btn full"} style={{background:"#858fc9", fontSize:"1.2rem"}} type="submit" >
                            {this.props.loggingIn
                                ? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />
                                : "Sign up"
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
                              to="/driver-login">
                              LOGIN
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
const mapStateToProps = ({userReducer}) => (
    {
        // driverSignupStarted:driverReducer.driverSignupStarted,
        serverMessage:userReducer.serverMessage
    }
)

export default connect(
    mapStateToProps,
    { signupUser }
)(withStyles(loginPageStyle)(DriverSingupPage));
