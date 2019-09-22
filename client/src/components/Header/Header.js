import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import logo from 'assets/img/safe_logo.png'
import { Avatar } from '@material-ui/core'
import { connect } from 'react-redux'
import Face from '@material-ui/icons/Face'
import Button from '@material-ui/core/Button'
import styled from '@emotion/styled'
import { minW } from '../../utils/helpers'
import { Menu, Close } from 'emotion-icons/material'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import loginIcon from '../../assets/img/icons/Login.svg'
import CarIcon from '../../assets/img/icons/car.svg'
import RiderIcon from '../../assets/img/icons/rider.svg'
import DriverEditProfilePage from "../../views/driver/DriverEditProfilePage";
import RiderEditProfilePage from "../../views/rider/RiderEditProfilePage";
import {openModal} from "../../actions";


const HeaderContainer = styled.header`
    max-width: 100%;
    margin: 0 auto;
    //z-index:10000;
`

const NavContainer = styled.nav`
    width: 100%;
    margin: 0 auto;
    height: 4.5rem;
    padding: 0 1em;
    display: flex;
    align-items: center;
    position: relative;

    & .header__navbar--toggle {
        background: transparent;
        color: white;
        transition: all 0.3s ease-in-out;

        //&:hover{
        //   color:pink;
        //   transform:scale(1)
        //}
    }

    ${minW('small')} {
        color: gray;
        justify-content: flex-end;
        & .header__navbar--toggle {
            color: gray;
            display: none;
        }
    }
`

const LogoContainer = styled.div`
    text-align: center;
    display: flex;
    align-items: center;
    transition: color 0.3s ease;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & a {
        color: white;
        font-weight: 700;
        display: flex;
        align-items: center;

        & img {
            width: 50px;
            vertical-align: middle;
            padding-right: 0.5rem;
            display: none;
        }
    }

    ${minW('small')} {
        left: 0;
        transform: translate(0, -50%);
        padding-left: 20px;
        & a img {
            display: block;
        }
    }
`
const AuthButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;

    & button {
        font-weight: bold;
        font-size: 0.8rem;
        outline: none;
        border: none;
        border-radius: 12px;
        color: white;
        padding: 10px 16px;
        margin-right: 12px;

        &.primary {
            background-color: #02b3e4;
            box-shadow: 8px 10px 20px 0px rgba(46, 61, 73, 0.15);
            border: 0.125rem solid transparent;
            letter-spacing: 0;
            display: none;

            &:hover {
                color: #02b3e4;
                background-color: white;
            }
        }

        &.show {
            display: block;
        }
    }

    ${minW('small')} {
        button.primary {
            display: block;
        }
    }
`

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this)
    }
    state = {
        mobileOpen: false,
        menuIsOpen: false,
    }

    handleDrawerToggle() {
        console.log('handleDrawerToggle')
        this.setState({ mobileOpen: !this.state.mobileOpen })
    }

    // handleOpenProfile = () => {
    //     this.handleDrawerToggle()
    //     this.props.history.push({
    //         pathname: `/${this.props.user.role}/edit-profile`,
    //         state: { prevPath: this.props.location.pathname },
    //     })
    // }

    // handleEditProfile = () => {
    //     this.props.history.push({
    //         pathname: `/${this.props.user.role}/edit-profile`,
    //         state: { prevPath: this.props.location.pathname },
    //     })
    // }

    logout() {
        this.props.logoutUser()
        this.setState({ mobileOpen: false })
    }
    
    navigateToUrl(url){
        this.handleDrawerToggle();
        this.props.history.push(url)
    }
    
    drawer = (
        <div>
            <div />
            <Divider />
            <img src={RiderIcon}/>Rider
            <List>
                <ListItem button onClick={() => this.navigateToUrl('/rider-login')}>
                    <ListItemIcon >
                        <img src={loginIcon} alt={'login icon'} />{' '}
                    </ListItemIcon>
                    <ListItemText primary={'Login'} />
                </ListItem>
                <ListItem button onClick={() => this.navigateToUrl('/rider-signup')}>
                    <ListItemIcon >
                        <Face />
                    </ListItemIcon>
                    <ListItemText primary={'Sign Up'} />
                </ListItem>
            </List>
            <Divider />
            <img src={CarIcon}/>Diver
            <List>
                <ListItem button onClick={() => this.navigateToUrl('/driver-login')}>
                    <ListItemIcon >
                        <img src={loginIcon} alt={'login icon'} />{' '}
                    </ListItemIcon>
                    <ListItemText primary={'Login'} />
                </ListItem>
                <ListItem button  onClick={() => this.navigateToUrl('/driver-signup')}>
                    <ListItemIcon>
                        <Face />
                    </ListItemIcon>
                    <ListItemText primary={'Sign Up'} />
                </ListItem>
            </List>
        </div>
    )

    render() {
        const { handleOpenProfile, openPanel, user } = this.props
        // console.log("user", user.avatar);
        return (
            <HeaderContainer className={'header'}>
                <NavContainer className={'header__navbar'}>
                    <Button
                        className={'header__navbar--toggle'}
                        aria-label="open drawer"
                        onClick={this.handleDrawerToggle}
                    >
                        <Menu style={{ fontSize: '45px' }} />
                    </Button>
                    <LogoContainer className={'header__navbar--logo'}>
                        <Link to="/">
                            <img src={logo} alt={'logo'} />
                            <span>RIDE FOR LIFE</span>
                        </Link>
                    </LogoContainer>
                    
                    {
                        user
                        ? (
                            <AuthButtonContainer>
                                <Button onClick={()=> handleOpenProfile(user.role)}>
                                    <Avatar
                                        src={user.avatar}
                                        alt={'avatar'}
                                    />
                                </Button>
                            </AuthButtonContainer>
                        )
                        : (
                            <AuthButtonContainer className={`show`}>
                                <Button
                                    className={'primary'}
                                    onClick={() => openPanel('login')}
                                >
                                    Sign In
                                </Button>
                            </AuthButtonContainer>
                        )
                    }
                </NavContainer>

                <Drawer
                    className={'header__navbar--navigation'}
                    style={{ zIndex: 9000, padding: '20px' }}
                    open={this.state.mobileOpen}
                    onClose={this.handleDrawerToggle}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.handleDrawerToggle}
                    >
                        <Close />
                    </IconButton>
                    {this.drawer}
                </Drawer>
            </HeaderContainer>
        )
    }
}

Header.defaultProp = {}

Header.propTypes = {}

const mapStateToProps = ({ riderReducer, driverReducer }) => {
    return {
        user: driverReducer.user || riderReducer.user,
    }
}
const mapDispatchToProps = dispatch => ({
    handleOpenProfile: (role) => {
        console.log('role', role)
        dispatch(openModal({shouldOpen:true, component: role ==='driver' ? DriverEditProfilePage : RiderEditProfilePage}))
    },
});
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Header)
)
