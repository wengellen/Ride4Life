import React, { Component } from 'react';
import './App.css';
import PinkButton from "../components/Button/PinkButton";
import Button from "../components/CustomButtons/Button.js";
import SectionCarousel from "../components/Carousel/SectionCarousel";
class HomePage extends Component {
    componentDidMount() {
    
    }
    
    render() {
    return (
      <div className="App">
            <img src="http://lorempixel.com/600/800/"/>
            {/*<SectionCarousel/>*/}
            <header className="App-header">
                <h1>Wecome</h1>
            </header>
          
           <div className="container">
             <p>If you are offered a seat on a rocket ship, don't ask what seat! Just get on.</p>
             <PinkButton>Next</PinkButton>
           </div>
      </div>
    );
  }
}

export default HomePage;
