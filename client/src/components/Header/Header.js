import React from 'react'
import {Link, NavLink, withRouter} from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import Menu from '@material-ui/icons/Menu'
import Close from '@material-ui/icons/Close'
// core components
import headerStyle from 'assets/jss/material-kit-pro-react/components/headerStyle.jsx'
import logo from 'assets/img/safe_logo.png'
import { Avatar } from '@material-ui/core'
import {connect} from "react-redux";
import Button from "../CustomButtons/Button";
import Face from '@material-ui/icons/Face'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this)
        this.headerColorChange = this.headerColorChange.bind(this)
    }
    state = {
        mobileOpen: false,
        menuIsOpen:false
    }

    handleDrawerToggle() {
        this.setState({ mobileOpen: !this.state.mobileOpen })
    }
    
    handleOpenProfile = () => {
        this.handleDrawerToggle()
        this.props.history.push({
            pathname:`/${this.props.user.role}/edit-profile`,
            state: { prevPath: this.props.location.pathname }})
    }
 
    logout() {
        this.props.logoutUser()
		this.setState({ mobileOpen: false})
        this.props.history.push("/")
    }

    headerColorChange() {
        const { classes, color, changeColorOnScroll } = this.props
        const windowsScrollTop = window.pageYOffset
        if (windowsScrollTop > changeColorOnScroll.height) {
            document.body
                .getElementsByTagName('header')[0]
                .classList.remove(classes[color])
            document.body
                .getElementsByTagName('header')[0]
                .classList.add(classes[changeColorOnScroll.color])
        } else {
            document.body
                .getElementsByTagName('header')[0]
                .classList.add(classes[color])
            document.body
                .getElementsByTagName('header')[0]
                .classList.remove(classes[changeColorOnScroll.color])
        }
    }
    componentWillUnmount() {
    }
  

    render() {
        console.log('this.props', this.props)
        const { classes, color, fixed, absolute, openPanel, user } = this.props
        const appBarClasses = classNames({
            [classes.appBar]: true,
            [classes[color]]: color,
            [classes.absolute]: absolute,
            [classes.fixed]: fixed,
        })
        return (
            <div className={`${appBarClasses}`}>
                <Link className={`classes.titleNoUnder`} to="/">
                    <div className={classes.logoContainer}>
                        <img src={logo} alt={'logo'} />
                    </div>
                </Link>
                <div className="icon-navbar">
                    {user ? (
                        <div className="login-container">
                            <IconButton className={`classes.titleNoUnder `}>
                                <Avatar src={user.avatar} color={"pink"} alt={"avatar"} />
                            </IconButton>
                        </div>
                    ) : (
                        <div className={`login-container ${!user ? "hide" : "show"}`}>
                            <button
                                className={"login"}
                                onClick={() => openPanel('login')}
                            >
                                Sign In
                            </button>
                            <button
                                className={"signup"}
                                onClick={() => openPanel('signup')}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                    <IconButton
                        className={`menuButton ${!user ? "hide" : "show"}`}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.handleDrawerToggle}
                    >
                        <Menu />
                    </IconButton>
                    {user &&
                    <Drawer
                        variant="temporary"
                        anchor={'right'}
                        open={this.state.mobileOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onClose={this.handleDrawerToggle}
                    >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.closeButtonDrawer}
                        >
                            <Close />
                        </IconButton>
                 
                        <div className="nav-drawer">
                            <ul className="nav-drawer-inner">
                                <li>
                                    <Button  className={"drawer-button"} onClick={this.handleOpenProfile}>
                                        <Face/>
                                        Profile</Button>
                                </li>
                                <li>
                                    <Button className={"drawer-button"} onClick={()=>this.logout()}>
                                        <Face/>
                                        Logout</Button>
                                </li>
                            </ul>
                        </div>
                    </Drawer>}
                </div>
            </div>
        )
    }
}

Header.defaultProp = {
    color: 'white',
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.oneOf([
        'primary',
        'info',
        'success',
        'warning',
        'danger',
        'transparent',
        'white',
        'rose',
        'dark',
    ]),
    links: PropTypes.node,
    brand: PropTypes.string,
    fixed: PropTypes.bool,
    absolute: PropTypes.bool,
    // this will cause the sidebar to change the color from
    // this.props.color (see above) to changeColorOnScroll.color
    // when the window.pageYOffset is heigher or equal to
    // changeColorOnScroll.height and then when it is smaller than
    // changeColorOnScroll.height change it back to
    // this.props.color (see above)
    changeColorOnScroll: PropTypes.shape({
        height: PropTypes.number.isRequired,
        color: PropTypes.oneOf([
            'primary',
            'info',
            'success',
            'warning',
            'danger',
            'transparent',
            'white',
            'rose',
            'dark',
        ]).isRequired,
    }),
}

const mapStateToProps = ({ riderReducer, driverReducer }) => {
    return {
        user: driverReducer.user || riderReducer.user,
    }
}

export default withRouter(connect(
    mapStateToProps,
    null
)(withStyles(headerStyle)(Header)))

