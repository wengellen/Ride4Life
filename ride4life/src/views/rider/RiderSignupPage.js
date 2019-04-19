import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import { signup_rider } from '../../actions';
import PinkButton from "../../components/Button/PinkButton";
import GridContainer from "../../components/Grid/GridContainer";
import Card from "../../components/Card/Card";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";
// import image from "assets/img/bg7.jpg";
import Button from "../../components/CustomButtons/Button";
import CustomInput from "../../components/CustomInput/CustomInput";
import CardBody from "../../components/Card/CardBody";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import Phone from "@material-ui/icons/Phone";
import Face from "@material-ui/icons/Face";
import Place from "@material-ui/icons/Place";

import {Link} from "react-router-dom";

class RiderSingupPage extends React.Component {
    state = {
        profile: {
            username: '',
            password: '',
            phone:'',
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
    
    signup = e => {
        e.preventDefault()
          this.setState({
            isEditing:false,
        })
        this.props.signup_rider(this.state.profile)
        .then((res) => {
            console.log('res', res)
            if(!res.data){
                this.props.history.push('/rider-login');
    
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
                                <form className={classes.form} onSubmit={this.signup}>
                                    <CardHeader
                                        color="success"
                                        signup
                                        className={classes.cardHeader}
                                    >
                                        <h2 className={classes.cardTitle}>Rider Sign Up</h2>
                                        <h4 className={classes.cardSubtitle}> Already Sign Up?
                                            <Link
                                                to="/rider-login">
                                                Login
                                            </Link>
                                        </h4>
                                    </CardHeader>
                                  
                                    <CardBody signup>
                                        <CustomInput
                                            id="first"
                                          
                                            formControlProps={{
                                                fullWidth: true,
                                                
                                            }}
                                            inputProps={{
                                                onChange:this.handleChange,
                                                value:this.state.profile.username,
                                                placeholder: "Useraname",
                                                name:'username',
                                                type: "text",
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
                                            id="cellphone"
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
                                    
                                    </CardBody>
                                    <div className={classes.textCenter}>
                                        <PinkButton type="submit" color="primary">
                                            {this.props.loggingIn
                                                ? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />
                                                : "Sign up"
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
const mapStateToProps = ({riderReducer}) => {
    return  {
        riderSignupStarted:riderReducer.riderSignupStarted,
        serverMessage:riderReducer.serverMessage
    }
}


export default connect(
    mapStateToProps,
    { signup_rider }
)(withStyles(loginPageStyle)(RiderSingupPage));
