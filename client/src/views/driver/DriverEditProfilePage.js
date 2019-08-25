import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import { signup_driver } from '../../actions';
import PinkButton from "../../components/Button/PinkButton";
import GridContainer from "../../components/Grid/GridContainer";
import Card from "../../components/Card/Card";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "../../assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";
// import image from "assets/img/bg7.jpg";
import CustomInput from "../../components/CustomInput/CustomInput";
import CardBody from "../../components/Card/CardBody";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import Phone from "@material-ui/icons/Phone";
import Face from "@material-ui/icons/Face";
import Place from "@material-ui/icons/Place";

import {
    uploadProfilePhoto,
} from '../../actions';
import FileUploadButton from "../../components/Button/FileUploadButton";


class DriverEditProfilePage extends React.Component {
  state = {
    profile: {
        email: '',
        username: '',
        password: '',
        phone:'',
        city:'',
    },
      
      isEditing: false,
      user:null,
      profilePhotoSelected:null
  };
  
componentWillMount(){
    this.setState({user :JSON.parse(localStorage.getItem('user'))})
}

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
  
  signupDriver = e => {
    e.preventDefault();
      this.setState({
          isEditing:false,
      })
    this.props.signup_driver(this.state.profile)
    .then((res) => {
        console.log('res', res)
        if(!res.data){
            this.props.history.push('/driver-login');
        }
    });
  };
    uploadPhoto = (e) => {
        this.preventDefault()
        uploadProfilePhoto(this.state.profilePhotoSelected, this.state.user._id).then(res => {
        
        })
    }
    
    handleFileSelected = (e) => {
        console.log('e',e)
        console.log(' e.target.files[0]', e.target.files[0])
        const errors = []

        const files = Array.from(e.target.files)
        const formData = new FormData()
        const types = ['image/png', 'image/jpeg', 'image/gif']
    
        
    
        files.forEach((file, i)  => {
            if (types.every(type => file.type !== type)){
                errors.push(`'${file.type}' is not a supported format`)
            }
            
            if (file.size > 150000){
                errors.push(`'${file.name}' is too large, please pick a smaller file`)
            }
            
            formData.append(i,file )
        })
        formData.append("_id", this.state.user._id)
        
        console.log('formData',formData)
        this.setState({ uploading: true })
        this.props.uploadProfilePhoto(formData).then(res => {
            console.log('res.data',res.data)
        //     this.setState({profilePhotoSelected:  e.target.files[0]})
        })
        // this.setState({profilePhotoSelected:  e.target.files[0]})
    }
  
  render() {
    const { classes, user } = this.props;
    return (
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card>
                    <div>
                        <h1>Edit Profile Page</h1>
                        <div>
                            <img className={"profileImageContainer"} src={'https://i.pravatar.cc/60'}></img>
                            <FileUploadButton  handleOnChange={this.handleFileSelected}/>
                        </div>
                    </div>
                  <form className={classes.form} onSubmit={this.editDriverProfile}>
                    <p
                        className={`${classes.description} ${classes.textCenter}`}
                    >
                    </p>
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
                              value:this.state.user.username,
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
                              value:this.state.user.password,
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
                                value:this.state.user.email,
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
                              value:this.state.user.phone,
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
                              value:this.state.user.city,
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
                        <button className={classes.submitBtn} type="submit" >
                               Save Changes
                      </button>
                    </div>
                    
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
              {/*<div>*/}
              {/*    <h2 className={`${classes.description} ${classes.textCenter}`}>*/}
              {/*        {!this.state.isEditing && this.props.serverMessage}*/}
              {/*    </h2>*/}
              
              {/*</div>*/}
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
    {uploadProfilePhoto }
)(withStyles(loginPageStyle)(DriverEditProfilePage));
