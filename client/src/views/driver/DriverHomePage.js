import React, { Component } from "react";
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
// import './DirectionMapDriver.css' // Updating node module will keep css up to date.
import './DriverHomePage.css' // Updating node module will keep css up to date.
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import {
    updateDriverLocation,
} from '../../actions'
import IconButton from "@material-ui/core/IconButton";
import  ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline'
import  PhoneIcon from '@material-ui/icons/Phone'
import Button from "../../components/CustomButtons/Button";
import socket from "../../utils/socketConnection";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class DriverHomePage extends Component {
    constructor(props) {
        super(props);
        const {dispatch} = this.props
        this.state = {
            location: [],
            startLocation: [],
            endLocation: [],
            distance: 0,
            longitude: 0,
            searchResultLayer: null,
            loadingMap: true,
            response: false,
            requestDetails:{},
            driverStatus:"offline",
            headerMessage:'',
            tripId:null
        }
        // this.socket = socketIOClient(this.state.endpoint)
        this.map = null
        this.directions =null
        this.startInput = null
        this.destInput = null
        this.instruction = null
        this.driver=JSON.parse(localStorage.getItem('user'))
    }
    
    componentWillUnmount() {
        socket.disconnect()
        if (this.map) {
            setTimeout(() => this.map.remove())
        }
        alert("Disconnecting Socket as component will unmount")
    }

    componentDidMount() {
            let map, directions, geolocate
            const driver = JSON.parse(localStorage.getItem('user'))
            let requestTimer
        navigator.geolocation.getCurrentPosition(position => {
            const coordinates = [
                position.coords.longitude,
                position.coords.latitude,
            ]
        
            socket.emit('UPDATE_DRIVER_LOCATION', {
                    coordinates,
                    role: 'driver',
                    username: driver.username,
                    driver: driver,
                },
            )
        
            this.setState({
                location: [position.coords.longitude, position.coords.latitude],
            })
        
            this.map = new mapboxgl.Map({
                container: this.mapContainer, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 15,
            })
        
            // Directions
            this.directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'imperial',
                profile: 'mapbox/driving',
            })
        
            this.directions.on('destination', e => {
                this.setState({
                    endLocation: e.feature.geometry.coordinates,
                    duration: e.feature.duration,
                    distance: e.feature.distance,
                    address: e.feature['place_name'],
                })
                console.log(e) // Logs the current route shown in the interface.
            })
        
            this.directions.on('route', function(e) {
                console.log('e.route',e.route) // Logs the current route shown in the interface.
                const steps = e.enroute && e.enroute[0]
            
                console.log('e.route.steps',steps)
                console.log(document.querySelectorAll(".mapbox-directions-instructions")[0])
            
                document.querySelectorAll(".mapbox-directions-instructions")[0].style.display = "block";
            })
    
            this.map.on('load', () => {
                this.startInput = document.querySelectorAll(".mapbox-directions-origin input")[0]
                this.destInput = document.querySelectorAll(".mapbox-directions-destination input")[0]
                console.log("document.querySelectorAll(\".mapbox-directions-instructions\")", document.querySelectorAll(".mapbox-directions-instructions"))
            })
    
            this.map.addControl(this.directions, 'top-left')
            this.map.addControl(new mapboxgl.NavigationControl());
    
    
            socket.on('REQUEST_TRIP', data => {
                const requestDetails = data
                console.log('data',data)
            
                if (this.state.driverStatus === 'requestIncoming') {
                    return;
                }
                localStorage.setItem('requestDetails', JSON.stringify( data))
            
                this.setState({
                    driverStatus:"requestIncoming",
                    requestDetails: data,
                    headerMessage:"You have 1 request. Offer ride?",
                })
                console.log(
                    'You have a new request! \n' +
                    JSON.stringify(requestDetails)
                )
                this.props.history.push('/driver-home/requestIncoming')
            })
        
        
            socket.on('RIDER_REQUEST_CANCELED', () => {
                this.setState({
                    driverStatus:"standby",
                    requestDetails: null,
                    headerMessage:"Request cancelled. Finding another ride for you",
                }) //Save request details
                console.log(
                    'You have a new request! \n'
                )
            
                localStorage.removeItem('requestDetails')
                this.props.history.push('/driver-home/standby')
            
            })
        
             socket.on('CONFIRM_TRIP', data => {
                clearTimeout(requestTimer)
                const requestDetails = data
                this.setState({
                    driverStatus:"confirmed",
                    requestDetails: data,
                    headerMessage:"Trip Confirmed",
                    tripId:data._id
                }) //Save request details
            
                console.log(
                    'Rider has accept your service! \n' +
                    JSON.stringify(requestDetails)
                )
            
                this.props.history.push('/driver-home/confirmed')
            })
        
             socket.on('RIDER_TRIP_CANCELED', () => {
                this.setState({
                    driverStatus:"standby",
                    headerMessage:"The trip has been cancelled",
                    requestDetails: null
                }) //Save request details
            
                console.log(
                    'RIDER_TRIP_CANCELED! \n'
                )
                localStorage.removeItem('requestDetails')
                document.querySelectorAll('.driver-map')[0].classList.add('hide-direction')
                this.props.history.push('/driver-home/standby')
            })
        
             socket.on('DRIVER_TRIP_CANCELED', () => {
                console.log(
                    'DRIVER_TRIP_CANCELED! \n'
                )
                this.setState({
                    driverStatus:"standby",
                    headerMessage:"Finding trip for you",
                    requestDetails: null
                })
            
                localStorage.removeItem('requestDetails')
                document.querySelectorAll('.driver-map')[0].classList.add('hide-direction')
                this.props.history.push('/driver-home/standby')
            })
        })
    }
    
    cancelTrip = () => {
        socket.emit('DRIVER_CANCEL_TRIP', {
            driver: JSON.parse(localStorage.getItem('user')),
            tripId:this.state.tripId
        })
        
        this.startInput.value = ""
        this.destInput.value = ""
    }
    
    handleStartTrip = (e) => {
        this.setState({
            driverStatus:"tripStarted",
        })
        const requestDetails = JSON.parse( localStorage.getItem('requestDetails'))
        this.directions.setOrigin(requestDetails.startLocation.coordinates)
        this.directions.setDestination(requestDetails.endLocationAddress)
        this.startInput.value = "Your Location"
        document.querySelectorAll('.driver-map')[0].classList.remove('hide-direction')
        e.target.style.display = "none"
        this.props.history.push('/driver-home/pickup')
    }
    
    
    handleDriveToUser = (e) => {
        this.setState({
            driverStatus:"pickup",
        })
        const requestDetails = JSON.parse( localStorage.getItem('requestDetails'))
        this.directions.setOrigin(this.state.location)
        this.directions.setDestination(requestDetails.startLocation.coordinates)
        this.startInput.value = "Your Location"
        document.querySelectorAll('.driver-map')[0].classList.remove('hide-direction')
        // document.querySelectorAll(".mapbox-directions-instructions")[0].classList.add('show')
        // this.instruction.classList.add('show')
        this.props.history.push('/driver-home/pickup')
        
    }
    
    handleAcceptTrip = (e) => {
        console.log('ACCEPT_TRIP', )
         socket.emit('ACCEPT_TRIP', {
            driver: JSON.parse(localStorage.getItem('user')),
            ...this.state.requestDetails,
        })
        
        this.setState({
            driverStatus:"waitingForConfirmation",
            headerMessage:"Waiting for rider confirmation."
        })
        
        this.props.history.push('/driver-home/waitingForConfirmation')
        
    }
    
    handleDriverGoOnline = () => {
        console.log('DRIVER_GO_ONLINE', )
        socket.on('DRIVER_READY_TO_ACCEPT_TRIP', () => {
            console.log(
                'DRIVER_READY_TO_ACCEPT_TRIP! \n'
            )
            this.setState({
                driverStatus:"standby",
                headerMessage:"Finding Trip for you..."
            })
        })
       socket.emit('DRIVER_GO_ONLINE', {
            driver: JSON.parse(localStorage.getItem('user'))
        })
        
        this.props.history.push('/driver-home/standby')
    }
    
    handleDriverGoOffline = () => {
        console.log('DRIVER_GO_OFFLINE', )
        
       socket.emit('DRIVER_GO_OFFLINE', {
            driver: JSON.parse(localStorage.getItem('user'))
        })
        socket.on('DRIVER_GONE_OFFLINE', () => {
            console.log(
                'DRIVER_GONE_OFFLINE! \n'
            )
            this.setState({driverStatus:"offline"})
        })
        this.props.history.push('/driver-home/offline')
    }
    
    getStatePath = (path) => {
        return path.split('/driver-home/')[1]
    }

  render() {
      const { driverStatus, headerMessage } = this.state
      const path = this.getStatePath(this.props.location.pathname)
    
      const requestDetails = JSON.parse( localStorage.getItem('requestDetails')) || null
    
      const statusPanel = () => {
          switch(path) {
              case "offline": return (
                  <div className={'status-panel'}>
                      <h1 className={`drivers-nearby-header`}>Ready to drive?</h1>
                      <p>
                      </p>
                      <Button className={'request-ride-button main'} onClick={this.handleDriverGoOnline}>GO ONLINE</Button>
                  </div>
              )
              case "standby": return (
                  <div className={'status-panel'}>
                      <h1 className={`drivers-nearby-header show-bg`}>{headerMessage}</h1>
                      <Loader type="Rings" color="#424B5A" height={100} width={100} />
                      <Button  className={'request-ride-button bordered'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</Button>
                  </div>
              )
              case "requestIncoming": return (
                  <div className={'status-panel'}>
                      <h1 className={`drivers-nearby-header  show-bg`}>{headerMessage}</h1>
                      <div className="driver-item-container-list requesting">
                          <div className="driver-img-container-list">
                              <img
                                  src={requestDetails.rider.avatar}
                                  alt={'driver'}
                              />
                          </div>
                          <div className="driver-item-content-list">
                              <h2>{requestDetails.rider.username}</h2>
                              <h3>
                                  2 miles away
                                  <span> {`, ${requestDetails.rider.rating} `}stars</span>
                              </h3>
                          </div>
                      </div>
                      <div className={"trip-destination-container"}>
                          <div className={"trip-destination-left"}>
                              <h2>{requestDetails.endLocationAddress}</h2>
                              <span className={"tag orange"}>{requestDetails.duration} mins</span>
                              <span className={"tag blue"}>{requestDetails.distance} mi</span>
                          </div>
                          <button className={"driver-item-accept-button requesting main"}
                                  onClick={(e)=> this.handleAcceptTrip(e)}>
                              <h2>${requestDetails.tripFare}</h2>
                              <h3>OFFER</h3>
                          </button>
                      </div>
                      <Button  className={'request-ride-button bordered'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</Button>
                  </div>
              )
            
              case "waitingForConfirmation": return (
                  <div className={'status-panel'}>
                      <h1 className={`drivers-nearby-header  show-bg`}>{headerMessage}</h1>
                      <div className="driver-item-container-list requesting">
                          <div className="driver-img-container-list">
                              <img
                                  src={requestDetails.rider.avatar}
                                  alt={'driver'}
                              />
                          </div>
                          <div className="driver-item-content-list">
                              <h2>{requestDetails.rider.username}</h2>
                              <h3>
                                  2 miles away
                                  <span> {`, ${requestDetails.rider.rating} `}stars</span>
                              </h3>
                          </div>
                      </div>
                      <div className={"trip-destination-container"}>
                          <div className={"trip-destination-left"}>
                              <h2>{requestDetails.endLocationAddress}</h2>
                              <span className={"tag orange"}>{requestDetails.duration} mins</span>
                              <span className={"tag blue"}>{requestDetails.distance} mi</span>
                          </div>
                          <button className={"driver-item-accept-button requesting main"}
                                  onClick={(e)=> this.handleAcceptTrip(e)}>
                              <Loader type="ThreeDots" color="#fff" height={40} width={40} />
                          </button>
                      </div>
                    
                      <Button  className={'request-ride-button bordered'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</Button>
                  </div>
              )
              case "confirmed": return (
                  <div className={'status-panel'}>
                      <h1 className={`drivers-nearby-header show-bg`}>{headerMessage}</h1>
                      <div
                          className="driver-item-container-list"
                      >
                          <div className="driver-img-container-list">
                              <img
                                  src={requestDetails.rider.avatar}
                                  alt={'driver'}
                              />
                          </div>
                          <div className="driver-item-content-list">
                              <h2>{requestDetails.rider.username}</h2>
                              <h3>
                                  2 miles away
                                  <span> {`, ${requestDetails.rider.rating} `}stars</span>
                              </h3>
                          </div>
                          <div className={"trip-destination-container"}>
                              <div className={"trip-destination-left"}>
                                  <h2>{requestDetails.endLocationAddress}</h2>
                                  <span className={"tag white"}>{requestDetails.duration} mins</span>
                                  <span className={"tag blue"}>{requestDetails.distance} mi</span>
                                  <span className={"tag pink"}>${requestDetails.tripFare}</span>
                              </div>
                          </div>
                          <div className={"driver-item-buttons-list"}>
                              {
                                  <div className={"action-icon-button-bar"}>
                                      <IconButton className={"driver-item-icon-button"}>
                                          <ChatBubbleIcon />
                                      </IconButton>
                                      <IconButton className={"driver-item-icon-button"}>
                                          <PhoneIcon />
                                      </IconButton>
                                  </div>
                              }
                          </div>
                      </div>
                      <Button className={'request-ride-button bordered'} onClick={this.cancelTrip}>CANCEL TRIP</Button>
                      <button className="main" onClick={this.handleDriveToUser}>PICKUP RIDER</button>
                  </div>
              )
              case "pickup": return (
                  <div className={'status-panel'}>
                      <h1 className={`drivers-nearby-header show-bg`}>{headerMessage}</h1>
                      <div
                          className="driver-item-container-list"
                      >
                          <div className="driver-img-container-list">
                              <img
                                  src={requestDetails.rider.avatar}
                                  alt={'driver'}
                              />
                          </div>
                          <div className="driver-item-content-list">
                              <h2>{requestDetails.rider.username}</h2>
                              <h3>
                                  2 miles away
                                  <span> {`, ${requestDetails.rider.rating} `}stars</span>
                              </h3>
                          </div>
                          <div className={"trip-destination-container"}>
                              <div className={"trip-destination-left"}>
                                  <h2>{requestDetails.endLocationAddress}</h2>
                                  <span className={"tag white"}>{requestDetails.duration} mins</span>
                                  <span className={"tag blue"}>{requestDetails.distance} mi</span>
                                  <span className={"tag pink"}>${requestDetails.tripFare}</span>
                              </div>
                          </div>
                          <div className={"driver-item-buttons-list"}>
                              {
                                  <div className={"action-icon-button-bar"}>
                                      <IconButton className={"driver-item-icon-button"}>
                                          <ChatBubbleIcon />
                                      </IconButton>
                                      <IconButton className={"driver-item-icon-button"}>
                                          <PhoneIcon />
                                      </IconButton>
                                  </div>
                              }
                          </div>
                      </div>
                      <Button className={'request-ride-button bordered'} onClick={this.cancelTrip}>CANCEL TRIP</Button>
                      <button color="info" className="main" onClick={this.handleStartTrip}>START TRIP</button>
                  </div>
              )
              case "trip-ended": return (
                  <div className={'status-panel'}>
                      <h1 className={`drivers-nearby-header show-bg `}>{headerMessage}</h1>
                      <div className="drivers-nearby-container-list">Trip Ended</div>
                      {/*<Button  className={'request-ride-button bordered'}  onClick={this.handleCancelRideRequest}></Button>*/}
                  </div>
              )
              default:      return <h1>No match</h1>
          }
      }
    return (
      <div className="map-wrapper ">
          <div className="map-container">
              <div
                  className="map-wrapper driver"
                  style={{ position: 'relative', display: 'flex' }}>
                  <div
                      ref={el => (this.mapContainer = el)}
                      className={`driver-map hide-direction`}
                      style={{
                          width: '100%',
                          height: '100%',
                      }}
                  />
                  {statusPanel()}
              </div>
          </div>
      </div>
    );
  }
}

const mapStateToProps = ({ driverReducer, tripReducer }, ownProps) => ({
    tripStatus:driverReducer.tripStatus,
})

export default connect(
  mapStateToProps,
  { updateDriverLocation}
)(DriverHomePage);
