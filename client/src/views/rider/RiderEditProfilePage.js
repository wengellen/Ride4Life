import React from 'react'
import { connect } from 'react-redux'
import serializeForm from 'form-serialize'
import Loader from 'react-loader-spinner'
import GridContainer from '../../components/Grid/GridContainer'
import GridItem from '../../components/Grid/GridItem'
import withStyles from '@material-ui/core/styles/withStyles'
import loginPageStyle from '../../assets/jss/material-kit-pro-react/views/loginPageStyle.jsx'
import CustomInput from '../../components/CustomInput/CustomInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import Email from '@material-ui/icons/Email'
import Phone from '@material-ui/icons/Phone'
import Face from '@material-ui/icons/Face'
import { uploadRiderProfile , logoutUser} from '../../actions'
import ImageInput from '../../components/ImageInput/ImageInput'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/core/SvgIcon/SvgIcon'
import Button from '@material-ui/core/Button'

class RiderEditProfilePage extends React.Component {
    state = {
        isEditing: false,
        profile: null,
        prevPath: null,
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        document.body.scrollTop = 0
    }

    handleChange = e => {
        this.setState({
            isEditing: true,
            profile: {
                ...this.state.profile,
                [e.currentTarget.name]: e.currentTarget.value,
            },
        })
    }

    editRiderProfile = e => {
        e.preventDefault()
        const values = serializeForm(e.target, { hash: true })
        this.props.uploadRiderProfile(values).then(res => {
            this.handleClose()
        })
    }
    
    logoutUser = e => {
        e.preventDefault()
        this.props.logoutUser()
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (prevState.isEditing) return null

        if (prevState.profile !== nextProps.user) {
            return {
                profile: { ...nextProps.user },
            }
        } else {
            return null
        }
    }

    handleClose = () => {
        let backUrl = this.props.location.state
            ? this.props.location.state.prevPath
            : '/rider-home/standby'
        this.props.history.push(backUrl)
    }

    render() {
        const { classes, user } = this.props
        const { profile } = this.state
        return (
            <div className={classes.container}>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4}>
                        <form
                            className={classes.form}
                            onSubmit={this.editRiderProfile}
                        >
                            <div className={'profile-header-container'}>
                                <h1>Edit Rider Profile</h1>
                                <br />
                                <div className={'avatar-input-container'}>
                                    <ImageInput
                                        className="avatar-input"
                                        name="avatar"
                                        maxValue={200}
                                        value={user.avatar}
                                    />
                                </div>
                            </div>
                            <p
                                className={`${classes.description} ${classes.textCenter}`}
                            ></p>
                            <div>
                                <CustomInput
                                    id="first"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        placeholder: 'Useraname',
                                        type: 'text',
                                        value: profile.username,
                                        name: 'username',
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Face
                                                    className={
                                                        classes.inputIconsColor
                                                    }
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <CustomInput
                                    id="email"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        placeholder: 'Email...',
                                        type: 'email',
                                        onChange: this.handleChange,
                                        value: profile.email,
                                        name: 'email',
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email
                                                    className={
                                                        classes.inputIconsColor
                                                    }
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <CustomInput
                                    id="phone"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        placeholder: 'Cell phone',
                                        type: 'phone',
                                        onChange: this.handleChange,
                                        value: profile.phone,
                                        name: 'phone',
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone
                                                    className={
                                                        classes.inputIconsColor
                                                    }
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div className={classes.textCenter}>
                                <button
                                    className={classes.submitBtn}
                                    type="submit"
                                >
                                    Save Changes
                                </button>
                                <Button
                                    style={{
                                        background: 'gray',
                                        color: 'white',
                                        padding: '10px 20px',
                                        marginTop: 20,
                                    }}
                                    onClick={this.logoutUser}
                                >
                                    Log Out
                                </Button>
                            </div>
                        </form>
                    </GridItem>
                </GridContainer>
                <IconButton
                    className="sliding-panel-close-button"
                    onClick={this.handleClose}
                >
                    <CloseIcon color="#353A50" />
                </IconButton>
            </div>
        )
    }
}
const mapStateToProps = ({ riderReducer }) => ({
    serverMessage: riderReducer.serverMessage,
    user: riderReducer.user,
})

export default connect(
    mapStateToProps,
    { uploadRiderProfile , logoutUser}
)(withStyles(loginPageStyle)(RiderEditProfilePage))
