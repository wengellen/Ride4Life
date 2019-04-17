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
            // location:'CA State',
            // email: 'eweng@gmail.com',
        }
    };
    
    componentDidMount() {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }
    
    handleChange = e => {
        console.log('e',e)
        this.setState({
            profile: {
                ...this.state.profile,
                [e.currentTarget.name]: e.currentTarget.value
            }
        });
    };
    
    signup = e => {
        console.log('signup clicked')
        e.preventDefault()
        console.log('this.state.profile',this.state.profile);
        this.props.signup_rider(this.state.profile).then(() => {
            console.log('his.props.login(this.state.profile).then')
            this.props.history.push('/rider-login');
        });
    };
    
    render() {
        const { classes } = this.props;
        return (
            <div>
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
                                    </CardHeader>
                                    <p
                                        className={`${classes.description} ${classes.textCenter}`}
                                    >
                                    </p>
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
                                                        
                                                        {/*<Icon className={classes.inputIconsColor}>*/}
                                                        {/*lockutline*/}
                                                        {/*</Icon>*/}
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        {/*<CustomInput*/}
                                            {/*id="location"*/}
                                            {/*formControlProps={{*/}
                                                {/*fullWidth: true*/}
                                            {/*}}*/}
                                            {/*inputProps={{*/}
                                                {/*value:`${this.state.profile.location}`,*/}
                                                {/*placeholder: "Location",*/}
                                                {/*type: "option",*/}
                                                {/*startAdornment: (*/}
                                                    {/*<InputAdornment position="start">*/}
                                                        {/*<Place className={classes.inputIconsColor}/>*/}
                                                    {/*</InputAdornment>*/}
                                                {/*)*/}
                                            {/*}}*/}
                                        {/*/>*/}
                                        {/*<CustomInput*/}
                                            {/*id="email"*/}
                                            {/*formControlProps={{*/}
                                                {/*fullWidth: true*/}
                                            {/*}}*/}
                                            {/*inputProps={{*/}
                                                {/*placeholder: "Email...",*/}
                                                {/*type: "email",*/}
                                                {/*value:`${this.state.profile.email}`,*/}
                                                {/*startAdornment: (*/}
                                                    {/*<InputAdornment position="start">*/}
                                                        {/*<Email className={classes.inputIconsColor} />*/}
                                                    {/*</InputAdornment>*/}
                                                {/*)*/}
                                            {/*}}*/}
                                        {/*/>*/}
                                    
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
                </div>
                {/*<form onSubmit={this.login}>*/}
                {/*<input*/}
                {/*type="text"*/}
                {/*name="username"*/}
                {/*value={this.state.credentials.username}*/}
                {/*onChange={this.handleChange}*/}
                {/*/>*/}
                {/*<input*/}
                {/*type="password"*/}
                {/*name="password"*/}
                {/*value={this.state.credentials.password}*/}
                {/*onChange={this.handleChange}*/}
                {/*/>*/}
                {/*<PinkButton>*/}
                {/*{this.props.loggingIn*/}
                {/*? <Loader type="ThreeDots" color="#1f2a38" height="12" width="26" />*/}
                {/*: "Log in"*/}
                {/*}*/}
                {/*</PinkButton>*/}
                {/*</form>*/}
            </div>
        );
    }
}
const mapStateToProps = ({riderReducer}) => (
    {
        riderSignupStarted:riderReducer.riderSignupStarted
    }
)

export default connect(
    mapStateToProps,
    { signup_rider }
)(withStyles(loginPageStyle)(RiderSingupPage));
