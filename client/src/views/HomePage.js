import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import '../App.css'
import Wrapper from './Wrapper'
import styled from '@emotion/styled'
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Button from '@material-ui/core/Button'
import { getUser } from '../utils/helpers'

const container = css`
	max-width: 73.75rem;
	margin-left: auto;
	margin-right: auto;
`

const HeroSection = styled.section`
	${container};
	margin-top: 0;
	padding: 0px 20px;
	width: 100%;
	text-align: center;

	&:before {
		content: '';
		width: 100%;
		height: 300px;
		z-index: -1000;
		background: linear-gradient(160deg, #02ccba 0%, #aa7ecd 100%);
		transform-origin: left bottom;
		position: absolute;
		top: 0;
		left: 0;
		transform: skew(0deg, -15deg);
	}

	& .hero--homepage--video {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
	}

	& a.hero--homepage--content {
		height: 24rem;
		color: white;

		& .content-inner {
			display: block;
			position: relative;
			top: 50%;
			transform: translateY(-50%);
			text-align: center;
		}

		& h6 {
			font-size: 0.8125rem;
			text-transform: uppercase;
			font-weight: 600;
			letter-spacing: 0.09rem;
			margin: 0;
		}

		& h1 {
			font-size: 2rem;
			line-height: 2.5rem;
			font-weight: 300;
			margin: 0.67em 0;
		}

		& p {
			font-size: 0.8125rem;
			line-height: 1.5rem;
		}

		& button {
			width: 13.75rem;
			background-color: #02b3e4;
			color: white;
			border: 0.125rem solid transparent;
			letter-spacing: 0.09375rem;
		}
	}
`

class HomePage extends Component {
	state = {
		user: null,
		showSlidingPanel: false,
		slidingPanelComponent: null,
	}
	
	componentDidMount() {
		// const loggedInUser = getUser()
		// if (loggedInUser) {
		// 	loggedInUser.role === 'driver'
		// 	? this.props.history.push('/driver/offline')
		// 	: this.props.history.push('/rider/standby')
		// }
	}
	
	onRequestRide = () => {
		this.props.history.push('/rider-login')
	}
	
	render() {

		return (
			<Wrapper>
				<HeroSection className={'hero--homepage container'}>
					<div className={'hero--homepage--video'}></div>
					<a className={'hero--homepage--content'}>
						<span className={'content-inner'}>
							<h6>Mothers Rideshare Service</h6>
							<h1>Ride for life</h1>
							<p>
								We make finding rides to take you to hospital
								innpm time for delivery easy and affordable
							</p>
							<Button
								className="green-btn"
								onClick={() => this.onRequestRide()}
							>
								Request Ride
							</Button>
						</span>
					</a>
				</HeroSection>
			</Wrapper>
		)
	}
}

export default withRouter(HomePage)
