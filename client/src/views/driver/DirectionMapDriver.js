import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
// import './DirectionMapDriver.css' // Updating node module will keep css up to date.
import './DriverHomePage.css' // Updating node module will keep css up to date.
import PinkButton from '../../components/Button/PinkButton' // Updating node module will keep css up to date.
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import {
    updateDriverLocation,
} from '../../actions'
import socketIOClient from 'socket.io-client'
import IconButton from "@material-ui/core/IconButton";
import  RightArrowIcon from '@material-ui/icons/KeyboardArrowRight'
import  ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline'
import  PhoneIcon from '@material-ui/icons/Phone'
import Button from "../../components/CustomButtons/Button";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class DirectionMapDriver extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location: [],
            startLocation: [],
            endLocation: [],
            distance: 0,
            longitude: 0,
            zoom: 12.5,
            searchResultLayer: null,
            loadingMap: true,
            response: false,
            requestDetails:{},
            endpoint:  process.env.NODE_ENV !== "production" ? "http://localhost:7000" : `https://ride4lifer.herokuapp.com`,
            driverStatus:"offline",
            headerMessage:'',
            tripId:null
        }
        this.socket = socketIOClient(this.state.endpoint)
       
        this.driver=JSON.parse(localStorage.getItem('user'))
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
            
            this.socket.emit('UPDATE_DRIVER_LOCATION', {
                coordinates,
                role: 'driver',
                username: driver.username,
                driver: driver,
              },
            )
            
    
            this.setState({
                location: [position.coords.longitude, position.coords.latitude],
            })
          
            map = new mapboxgl.Map({
                container: this.mapContainer, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 15,
            })
    
            // Directions
            directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'imperial',
                profile: 'mapbox/driving',
            })
            
            directions.on('destination', e => {
                this.setState({
                    endLocation: e.feature.geometry.coordinates,
                    duration: e.feature.duration,
                    distance: e.feature.distance,
                    address: e.feature['place_name'],
                })
                console.log(e) // Logs the current route shown in the interface.
            })
    
            directions.on('route', function(e) {
                console.log(e.route) // Logs the current route shown in the interface.
            })
    
            map.addControl(directions, 'top-left')
            map.addControl(geolocate, 'top-right')
    
    
            map.on('load', () => {
                // directions.setOrigin([
                //     position.coords.longitude,
                //     position.coords.latitude,
                // ])
            })
    
            this.socket.on('REQUEST_TRIP', data => {
                const requestDetails = data
                console.log('data',data)
                if (this.state.driverStatus === 'requestIncoming') {
                    return;
                }
        
                this.setState({
                    driverStatus:"requestIncoming",
                    requestDetails: data,
                    headerMessage:"You have 1 request. Offer ride?",
                })
                console.log(
                    'You have a new request! \n' +
                    JSON.stringify(requestDetails)
                )
                //
                // requestTimer = setTimeout(() => {
                //     this.setState({
                //         requestDetails: null,
                //         driverStatus:"standby",
                //         headerMessage:"Finding rides for you",
                //     })
                //
                //     this.socket.emit('DENY_TRIP_REQUEST',  {
                //         driver: JSON.parse(localStorage.getItem('user')),
                //         tripId:this.state.tripId
                //     })
                // }, 20000)
            })
    
    
            this.socket.on('RIDER_REQUEST_CANCELED', () => {
                this.setState({
                    driverStatus:"standby",
                    requestDetails: null,
                    headerMessage:"Request cancelled. Finding another ride for you",
                }) //Save request details
                console.log(
                    'You have a new request! \n'
                )
        
            })
    
            this.socket.on('CONFIRM_TRIP', data => {
                clearTimeout(requestTimer)
                const requestDetails = data
                this.setState({
                    driverStatus:"confirmed",
                    requestDetails: data,
                    headerMessage:"Drive to pickup location",
                    tripId:data._id
                }) //Save request details
        
                console.log(
                    'Rider has accept your service! \n' +
                    JSON.stringify(requestDetails)
                )
            })
    
            this.socket.on('RIDER_TRIP_CANCELED', () => {
                this.setState({
                    driverStatus:"standby",
                    headerMessage:"The trip has been cancelled",
                    requestDetails: null
                }) //Save request details
        
                console.log(
                    'RIDER_TRIP_CANCELED! \n'
                )
            })
    
            this.socket.on('DRIVER_TRIP_CANCELED', () => {
                console.log(
                    'DRIVER_TRIP_CANCELED! \n'
                )
                this.setState({
                    driverStatus:"standby",
                    headerMessage:"Finding trip for you",
                    requestDetails: null
                })
            })
        })
    }
    
   
    cancelTrip = () => {
        this.socket.emit('DRIVER_CANCEL_TRIP', {
            driver: JSON.parse(localStorage.getItem('user')),
            tripId:this.state.tripId
        })
    }
    handleAcceptTrip = (e) => {
        // e.currentTarget.style = "display:none"
        console.log('ACCEPT_TRIP', )
        this.socket.emit('ACCEPT_TRIP', {
            driver: JSON.parse(localStorage.getItem('user')),
            ...this.state.requestDetails,
        })
        
        this.setState({
            driverStatus:"waitingForConfirmation",
            headerMessage:"Waiting for rider confirmation."
        })
        
    }
    
    handleDriverGoOnline = () => {
        console.log('DRIVER_GO_ONLINE', )
        this.socket.on('DRIVER_READY_TO_ACCEPT_TRIP', () => {
            console.log(
                'DRIVER_READY_TO_ACCEPT_TRIP! \n'
            )
            this.setState({
                driverStatus:"standby",
                headerMessage:"Finding Trip for you..."
                })
        })
        this.socket.emit('DRIVER_GO_ONLINE', {
            driver: JSON.parse(localStorage.getItem('user'))
        })
    }
    
    
    handleDriverGoOffline = () => {
        console.log('DRIVER_GO_OFFLINE', )
        this.socket.emit('DRIVER_GO_OFFLINE', {
            driver: JSON.parse(localStorage.getItem('user'))
        })
        this.socket.on('DRIVER_GONE_OFFLINE', () => {
            console.log(
                'DRIVER_GONE_OFFLINE! \n'
            )
            this.setState({driverStatus:"offline"})
        })
    }
    
    
    render() {
        const { driverStatus, requestDetails, headerMessage } = this.state
        const statusPanel = () => {
            switch(driverStatus) {
                case "offline": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header`}>Ready to drive? {this.driver.username}</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur dolor sit amet,
                            consectetur
                        </p>
                        <Button className={'request-ride-button main'} onClick={this.handleDriverGoOnline}>GO ONLINE</Button>
                    </div>
                  )
                case "standby": return (
                        <div className={'status-panel'}>
                            <h1 className={`drivers-nearby-header show-bg`}>{headerMessage}</h1>
                            <Loader/>
                            {/*<p>*/}
                            {/*    Lorem ipsum dolor sit amet, consectetur dolor sit amet,*/}
                            {/*    consectetur*/}
                            {/*</p>*/}
                            <Button  className={'request-ride-button bordered main'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</Button>
                        </div>
                    )
                case "requestIncoming": return (
                    <div className={'status-panel'}>
                             <h1 className={`drivers-nearby-header  show-bg`}>{headerMessage}</h1>
                             <div className="driver-item-container-list requesting">
                                <div className="driver-img-container-list">
                                    <img
                                        src={this.state.requestDetails.rider.avatar}
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
                                <h2>2398 Walters way, Concord</h2>
                                <span className={"tag orange"}>35 mins</span>
                                <span className={"tag blue"}>21 mi</span>
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
                                    src={this.state.requestDetails.rider.avatar}
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
                                <h2>2398 Walters way, Concord</h2>
                                <span className={"tag orange"}>35 mins</span>
                                <span className={"tag blue"}>21 mi</span>
                            </div>
                            
                            <button className={"driver-item-accept-button requesting main"}
                                     disabled>
                                <Loader/>
                            </button>
                        </div>
                        {/*</div>*/}
            
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
                        <Button className={'request-ride-button bordered main'} onClick={this.cancelTrip}>CANCEL TRIP</Button>
                    </div>
                )
                default:      return <h1>No project match</h1>
            }
        }
    
        return (
         <div
                className="map-wrapper driver"
                style={{ position: 'relative', display: 'flex' }}>
                
                <div
                    ref={el => (this.mapContainer = el)}
                    className={`driver-map ${driverStatus!== "confirmed" &&  "hide-direction"}`}
                    // className={`driver-map hide-direction`}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                ></div>
             {statusPanel()}
            </div>
        )
    }
}
const mapStateToProps = ({ driverReducer, tripReducer }) => ({
    tripStatus:driverReducer.tripStatus,
})
export default connect(
    mapStateToProps,
    { updateDriverLocation }
)(DirectionMapDriver)
