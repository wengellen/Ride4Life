import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import Menu from '@material-ui/icons/Menu'
import Close from '@material-ui/icons/Close'
// core components
// import headerStyle from 'assets/jss/material-kit-pro-react/components/headerStyle.jsx'
import logo from 'assets/img/safe_logo.png'
import placeholder from 'assets/img/placeholder.jpg'
import { Avatar } from '@material-ui/core'
import { connect } from 'react-redux'
import Face from '@material-ui/icons/Face'
import Button from '@material-ui/core/Button'

/** @jsx jsx */
import { jsx, css } from "@emotion/core";

// const useStyles = makeStyles({
//     headerWrapper:{
//
//     },
//     titleNoUnder:{
//     },
//     logoContainer:{
//
//     },
//     icon-navbar:{
//
//     }
// })

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
        this.setState({ mobileOpen: !this.state.mobileOpen })
    }

    handleOpenProfile = () => {
        this.handleDrawerToggle()
        this.props.history.push({
            pathname: `/${this.props.user.role}/edit-profile`,
            state: { prevPath: this.props.location.pathname },
        })
    }

    handleEditProfile = () => {
        this.props.history.push({
            pathname: `/${this.props.user.role}/edit-profile`,
            state: { prevPath: this.props.location.pathname },
        })
    }

    logout() {
        this.props.logoutUser()
        this.setState({ mobileOpen: false })
    }

    render() {
        const { openPanel, user } = this.props
        
        return (
            <div
                css={theme => ({
                    display:"flex",
                    height:"176px",
                    padding: "20px",
                    outline:"1px solid red"
                })}
            >
                <Link  to="/">
                    <div css={theme => ({
                            color: "red",
                        })}
                        >
                        <img src={logo} alt={'logo'} />
                    </div>
                </Link>
                <div className="icon-navbar">
                    {user ? (
                        <>
                            <div className="login-container">
                                <IconButton
                                    onClick={this.handleEditProfile}
                                >
                                    <Avatar
                                        src={user.avatar || placeholder}
                                        alt={'avatar'}
                                    />
                                </IconButton>
                            </div>
                            
                            <IconButton
                                // className={`menuButton show}`}
                                css={theme => ({
                                    display:"block"
                                })}
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                            >
                                <Menu/>
                            </IconButton>
                            <Drawer
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

                                <div className="nav-drawer">
                                    <ul className="nav-drawer-inner">
                                        <li>
                                            <Button
                                                className={'drawer-button'}
                                                onClick={this.handleOpenProfile}
                                            >
                                                <Face />
                                                Profile
                                            </Button>
                                        </li>
                                        <li>
                                            <Button
                                                className={'drawer-button'}
                                                onClick={() => this.logout()}
                                            >
                                                <Face />
                                                Logout
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </Drawer>
                        </>
                    ) : (
                        <div className={`login-container show}`}>
                            <button
                                className={'login'}
                                onClick={() => openPanel('login')}
                            >
                                Sign In
                            </button>
                            <button
                                className={'signup'}
                                onClick={() => openPanel('signup')}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
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

export default withRouter(
    connect(
        mapStateToProps,
        null
    )( Header)
)
