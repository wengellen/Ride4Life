import React, { Component } from 'react';
import '../App.css';
import styled from '@emotion/styled'
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import {mediaQ} from '../utils/helpers'

const HeroSection = styled.section`
   content:'';
   width:100%;
   height:300px;
   z-index:-1000;
   background:linear-gradient(160deg, #02ccba 0%, #AA7ECD 100%);
   position:absolute;
   top:0;
   left:0;
`

class HomePage extends Component {
    onRequestRide = () => {
    	this.props.history.push('/rider-login')
    }

    
    render() {
        const {user} = this.props
        return (
          <HeroSection className={"hero--homepage"}>
                {/*<div className={"home-page-image-holder"}>*/}
                {/*    <h1>Welcome to <br/> Ride for life</h1>*/}
                {/*</div>*/}
                <main className={"app-content"}>
                    <p>A RideSharing service for <br/>soon-to-be mothers <br/></p>
                    <button className="green-btn" onClick={()=> this.onRequestRide()}>Request Ride</button>
                </main>
          </HeroSection>
        );
  }
}

export default HomePage
