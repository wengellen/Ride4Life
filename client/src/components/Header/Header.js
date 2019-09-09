import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import logo from 'assets/img/safe_logo.png'
import placeholder from 'assets/img/placeholder.jpg'
import { Avatar } from '@material-ui/core'
import { connect } from 'react-redux'
import Face from '@material-ui/icons/Face'
import Button from '@material-ui/core/Button'
import styled from '@emotion/styled'
import { minW } from '../../utils/helpers'
import { Account, Menu, Close } from 'emotion-icons/material'
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const NavContainer = styled.nav`
        width: 100%;
        margin: 0 auto;
        height: 4.5rem;
        padding: 0 1em;
        display: flex;
        align-items: center;
        & button{
           color:white;
        }
        ${minW('small')} {
            color: gray;
            justify-content: flex-end;
            & button {
                color: gray;
                display: none;
            }
        }
`

const LogoContainer = styled.div`
        text-align:  center ;
        display:  flex;
        align-items:  center;
        transition:  color 0.3s ease;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        
        & a{
            color:white;
            font-weight:700;
            display:flex;
            align-items:  center;
            
            & img{
                width: 50px;
                vertical-align:middle;
                padding-right: 0.5rem;
                display:none;
            }
        }

        ${minW('small')}{
             left:0;
             transform:translate(0, -50%);
             padding-left:20px;
              & a img{
                display:block;
              }
        }
`
const AuthButtonContainer = styled.div`
    display:flex;
    justify-content: flex-end;
    
    & button{
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
            border:0.125rem solid transparent;
            letter-spacing: 0;
            display:none;
        }
        
        &.show {
            display: block;
        }
     }
 
     ${minW('small')}{
        button.primary{
           display:block;
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
            <header
                className={'header'}
                css={theme => ({
                    maxWidth: '100%',
                    margin: '0 auto',
                })}
            >
                <NavContainer
                    className={'header__navbar'}
                >
                    <button
                        className={'header__navbar--toggle'}
                        
                        aria-label="open drawer"
                        onClick={this.handleDrawerToggle}
                    >
                        <Menu style={{ fontSize: '45px' }} />
                    </button>
                    <LogoContainer className={'header__navbar--logo'}>
                        <Link to="/">
                            <img
                                src={logo}
                                alt={'logo'}
                            />
                            <span>RIDE FOR LIFE</span>
                        </Link>
                    </LogoContainer>

                    {user ? (
                        <>
                            <div>
                                <IconButton onClick={this.handleEditProfile}>
                                    <Avatar
                                        src={user.avatar || placeholder}
                                        alt={'avatar'}
                                    />
                                </IconButton>
                            </div>

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
                        <AuthButtonContainer className={`login-container show}`}>
                            <button
                                className={'primary'}
                                onClick={() => openPanel('login')}
                            >
                                Sign In
                            </button>
                            {/*<AuthButton*/}
                            {/*    className={'primary'}*/}
                            {/*    onClick={() => openPanel('signup')}*/}
                            {/*>*/}
                            {/*    Sign Up*/}
                            {/*</AuthButton>*/}
                        </AuthButtonContainer>
                    )}
                </NavContainer>
            </header>
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

export default withRouter(
    connect(
        mapStateToProps,
        null
    )(Header)
)
