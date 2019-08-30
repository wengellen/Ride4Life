import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
import './DirectionMap.css'
import './RiderHomePage.css'

import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import  RightArrowIcon from '@material-ui/icons/KeyboardArrowRight'
import  ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline'
import  PhoneIcon from '@material-ui/icons/Phone'
import {
    findDriversNearby,
    getDriversById,
    sendTripRequest,
    updateRiderLocation,
    cancelTripRequest,
    confirmTripRequest
} from '../../actions'
import socketIOClient from 'socket.io-client'
import IconButton from "@material-ui/core/IconButton";
import Button from "../../components/CustomButtons/Button";
import {withRouter} from "react-router";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class DirectionMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location: [-122.431297, 37.7749],
            startLocation: [-122.431297, 37.7749],
            endLocation: [0, 0],
            startLocationAddress:null,
            endLocationAddress: null,
            distance: 0,
            longitude: 0,
            searchResultLayer: null,
            loadingMap: true,
            response: false,
            endpoint:
                process.env.NODE_ENV !== 'PRODUCTION'
                    ? 'http://localhost:7000'
                    : 'https://ride4lifer.herokuapp.com/',
            showEstimate: false,
            requestDetails: null,
            requestingRide: false,
            tripStatus:"standby",
            tripFare:0,
            tripId:null,
            acceptedDrivers:[],
            currentDriver:null,
            headerMessage:''
        }
        this.socket = socketIOClient(this.state.endpoint)
        this.map = null
        this.directions = null
        this.geolocate = null
        this.rider = JSON.parse(localStorage.getItem('user'))
    }

    mapContainer = React.createRef()

    componentDidMount() {
        const rider = JSON.parse(localStorage.getItem('user'))
        navigator.geolocation.getCurrentPosition(position => {
            console.log('position', position)
            this.setState({
                startLocation: [
                    position.coords.longitude,
                    position.coords.latitude,
                ],
                location: [position.coords.longitude, position.coords.latitude],
                loadingMap: false,
            })
    
            this.map = new mapboxgl.Map({
                container: this.mapContainer, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
                style: 'mapbox://styles/mapbox/streets-v9',
                center: this.state.startLocation,
                zoom: 13,
            })
    
            // Directions
            this.directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'imperial',
                profile: 'mapbox/driving',
            })
    
            this.directions.on('origin', e => {
                let startInput = document.querySelectorAll(".mapbox-directions-origin input")[0]
                this.setState({
                    startLocation: e.feature.geometry.coordinates,
                    startLocationAddress:startInput.value
                })
        
                startInput.value = "Your Location"
            })
    
            this.directions.on('destination', e => {
                let destInput = document.querySelectorAll(".mapbox-directions-destination input")[0]
                this.setState({
                    endLocation: e.feature.geometry.coordinates,
                    endLocationAddress:destInput.value
                })
            })
    
            this.directions.on('route', e => {
                console.log('e',e)
                if ( e.route && e.route.length){
                    const {distance, legs, duration} = e.route[0]
                    this.setState({
                        endLocationAddress: legs[0].summary,
                        duration: document.querySelectorAll(".mapbox-directions-component.mapbox-directions-route-summary > span")[0].textContent.split("min")[0] ,
                        distance: document.querySelectorAll(".mapbox-directions-component.mapbox-directions-route-summary > h1")[0].textContent.split("mi")[0] ,
                    })
                }
            })
    
            this.geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                    watchPosition: true,
                },
            })
    
            this.map.addControl(this.directions, 'bottom-left')
            this.map.addControl(this.geolocate, 'top-right')
            this.map.on('load', () => {
                this.directions.setOrigin(this.state.startLocation)
            })
            this.socket.emit('UPDATE_RIDER_LOCATION', {
                coordinates: [
                    position.coords.longitude,
                    position.coords.latitude,
                ],
                role: 'rider',
                username: rider.username,
                rider: rider,
            })
        })
    
        this.socket.on('ACCEPT_TRIP', data => {
            console.log('ACCEPT_TRIP data', data)
            this.setState({
                showEstimate: true,
                requestDetails: data,
                tripStatus:"driversFound",
                headerMessage:`Drivers found. Accept offer?`,
                acceptedDrivers:[...this.state.acceptedDrivers, data.driver]
            }) //Save request details
            console.log(
                'A driver has accepted your trip \n' + JSON.stringify(data)
            )
            this.props.history.push('/rider-home/driversFound')
        })
    
        this.socket.on('RIDER_TRIP_CANCELED', () => {
            console.log(
                'RIDER_TRIP_CANCELED! \n'
            )
            this.setState({
                tripStatus:"standby",
                headerMessage:"Start a new ride",
                acceptedDrivers:[]
            })
            this.props.history.push('/rider-home/standby')
    
        })
    
        this.socket.on('DRIVER_TRIP_CANCELED', () => {
            console.log(
                'DRIVER_TRIP_CANCELED! \n'
            )
            this.setState({
                tripStatus:"standby",
                headerMessage:"Send a new request",
                acceptedDrivers:[]
            })
            this.props.history.push('/rider-home/standby')
        })
    
        this.socket.on('DRIVER_GO_OFFLINE', (data) => {
            console.log(
                'DRIVER_GO_OFFLINE! \n'
            )
            
            const newArr = this.state.acceptedDrivers.filter(driver => driver.username !== data.driver.username)
            this.setState({
                acceptedDrivers: newArr,
                tripStatus:"requesting",
                headerMessage:"Finding drivers for you",
            })
        })

    }

    componentWillUnmount = () => {
        console.log('this.map', this.map)
        if (this.map) {
            setTimeout(() => this.map.remove())
        }
    }

    loadDriverProfile = driver => {
        console.log('driver', driver)
        this.props.getDriversById(driver._id).then(() => {
            this.props.history.push(`/rider-home/driver/${driver._id}`)
        })
    }
    
    handleCancelRideRequest = () => {
        const rider = JSON.parse(localStorage.getItem('user'))
    
        this.socket.emit('RIDER_CANCEL_REQUEST', {
           rider: JSON.parse(localStorage.getItem('user')),
           tripId:this.state.tripId
        })
        this.socket.on('RIDER_REQUEST_CANCELED', () => {
            console.log(
                'RIDER_REQUEST_CANCELED! \n'
            )
        })
        this.setState({
            requestingRide: false,
            tripStatus:"standby",
            headerMessage:"Start a new ride",
            acceptedDrivers:[]
        })
        this.props.cancelTripRequest()
        this.props.history.push('/rider-home/standby')
    }
    
    handleKeyPress = (e) => {
        if (e.which < 48 || e.which > 57)
        {
            e.preventDefault();
        }
    }
    
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }
    
    cancelTrip = () => {
        this.socket.emit('RIDER_CANCEL_TRIP', {
            rider: JSON.parse(localStorage.getItem('user')),
            tripId:this.state.tripId
        })
        this.setState({acceptedDrivers:[]})
        this.props.history.push('/rider-home/standby')
    }
    

    handleRequestRide = () => {
        const tripRequest = {
            startLocation: {
                coordinates: this.state.startLocation,
                type: 'Point',
            },
            endLocation: {
                coordinates: this.state.endLocation,
                type: 'Point',
            },
            location: {
                coordinates: this.state.location,
                type: 'Point',
            },
            startLocationAddress:this.state.startLocationAddress,
            endLocationAddress:this.state.endLocationAddress,
            distance: this.state.distance,
            duration: this.state.duration,
            tripFare:this.state.tripFare,
        }

        this.setState({
            requestingRide: true,
            tripStatus:"requesting",
            headerMessage:"Quote Submitted to Drivers",
        })
    
        this.socket.emit('REQUEST_TRIP', {
            rider: JSON.parse(localStorage.getItem('user')),
            ...tripRequest,
        })
        //
        this.socket.on('TRIP_REQUESTED', data => {
            this.setState({tripId:data})
            console.log(
                'TRIP_ID \n' + JSON.stringify(data)
            )
        })
    }

    handleConfirmRequest = (idx) => {
        const driver = this.state.acceptedDrivers[idx]
        console.log('idx',idx)
        console.log('driver',driver)
        localStorage.setItem('currentDriver',JSON.stringify(driver))
        this.socket.emit('CONFIRM_TRIP', {
            driverId:driver._id,
            driverUsername:driver.username,
            ...this.state.requestDetails,
        })
    
        
        this.setState({
            showEstimate: false,
            currentDriver:driver,
            headerMessage:"Your driver is on his way",
            tripStatus:"confirmed"
        })
        
        // this.props.history.push('/rider-home/confirmed')
    }
    
    getStatePath = (path) => {
        return path.split('/rider-home/')[1]
    }

    render() {
        const { findNearbyDriverMessage, driversNearby,  } = this.props
        const { requestingRide, tripFare, tripStatus, acceptedDrivers, headerMessage } = this.state
    
        const currentDriver = JSON.parse(localStorage.getItem('currentDriver'))
    
        // let path = this.getStatePath(this.props.location.pathname)
        // if(tripStatus !== path){
        //   // NOT Allowed
        //     console.log('tripStatus',tripStatus)
        //     path = tripStatus
        // }
        
        let path = tripStatus
        const statusPanel = () => {
            switch(path) {
                case "standby": return (
                    <div className={'status-panel standby'}>
                        <h1 className={`drivers-nearby-header}`}>Request a Ride?</h1>
                        <p>
                            Enter hospital and name your fare!
                        </p>
                        <div className={"driver-name-your-fare-container"}>
                            <h2>$</h2>
                            <input pattern="[0-9]" name={"tripFare"} type={"text"} placeholder={"Name your fare"}
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleKeyPress}/>
                        </div>
                        <button className={"driver-item-accept-button main full"} onClick={(e)=> this.handleRequestRide(e)}>REQUEST RIDE</button>
                    </div>
                )
                case "requesting": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header show-bg`}>{headerMessage}</h1>
                        <Loader type="Rings" color="#424B5A" height={100} width={100} />
                        <Button  className={'request-ride-button bordered'}  onClick={this.handleCancelRideRequest}>CANCEL REQUEST</Button>
                    </div>
                    )
                case "driversFound": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header show-bg`}>{headerMessage}</h1>
                        <p>
                        </p>
                        <div className="drivers-nearby-container-list">
                            { acceptedDrivers &&
                            acceptedDrivers.map((driver, idx) => {
                                return (
                                    <div
                                        className="driver-item-container-list"
                                        key={idx}
                                    >
                                        <div className="driver-img-container-list">
                                            <img
                                                src={driver.avatar}
                                                alt={'driver'}
                                            />
                                        </div>
                                        <div className="driver-item-content-list">
                                            <h2>{driver.username}</h2>
                                            <h3>
                                                2 miles away
                                                <span> {`, ${driver.rating} `}stars</span>
                                            </h3>
                                        </div>
                                        <div className={"driver-item-buttons-list"}>
                                                    <IconButton className={"driver-item-accept-button main"}
                                                                onClick={()=> this.handleConfirmRequest(idx)}>ACCEPT</IconButton>
                            
                                        </div>
                                        <IconButton className={"right-arrow-button "}
                                                    onClick={e =>
                                                        this.loadDriverProfile(driver)
                                                    }>
                                            <RightArrowIcon />
                                        </IconButton>
                                    </div>
                                )
                            })}
                        </div>
                        <Button  className={'request-ride-button bordered'}  onClick={this.handleCancelRideRequest}>CANCEL REQUEST</Button>
                    </div>
                )
                case "confirmed": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header show-bg `}>{headerMessage}</h1>
                        <div className="drivers-nearby-container-list">
                            { currentDriver &&
                                (
                                    <div
                                        className="driver-item-container-list"
                                    >
                                        <div className="driver-img-container-list">
                                            <img
                                                src={currentDriver.avatar}
                                                alt={'driver'}
                                            />
                                        </div>
                                        <div className="driver-item-content-list">
                                            <h2>{currentDriver.username}</h2>
                                            <h3>
                                                2 miles away
                                                <span> {`, ${currentDriver.rating} `}stars</span>
                                            </h3>
                                        </div>
                                        <div className={"driver-item-buttons-list"}>
                                                <div className={"action-icon-button-bar"}>
                                                    <IconButton className={"driver-item-icon-button"}>
                                                        <ChatBubbleIcon />
                                                    </IconButton>
                                                    <IconButton className={"driver-item-icon-button"}>
                                                        <PhoneIcon />
                                                    </IconButton>
                                                </div>
                                        </div>
                                        <IconButton className={"right-arrow-button "}
                                                    onClick={e =>
                                                        this.loadDriverProfile(currentDriver)
                                                    }>
                                            <RightArrowIcon />
                                        </IconButton>
                                    </div>
                                )
                            }
                        </div>
                        <Button className={'request-ride-button bordered'}
                                onClick={e => this.cancelTrip()}>
                                CANCEL TRIP</Button>
                    </div>
                   )
                default:      return <h1>No project match</h1>
            }
        }
        
        return (
           this.state.loadingMap ? (
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                    }}
                >
                    <Loader type="ThreeDots" color="white" height="50" width="50" />
                    <h3>Loading...</h3>
                </div>
            ) : (
            
                <div
                    className="map-wrapper "
                    style={{ position: 'relative', display: 'flex' }}
                >
                    <div
                        ref={el => (this.mapContainer = el)}
                        className={`map ${tripStatus!== "standby" &&  "hide-direction"}`}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    ></div>
                    {statusPanel()}
            </div>
        ))
    }
}
const mapStateToProps = ({ riderReducer, tripReducer }) => ({
    findNearbyDriverStarted: riderReducer.findNearbyDriverStarted,
    driversNearby: riderReducer.driversNearby,
    findNearbyDriverMessage: riderReducer.findNearbyDriverMessage,
    tripStatus:riderReducer.tripStatus,
    submitDriverReviewSuccessMessage:
        riderReducer.submitDriverReviewSuccessMessage,
})

export default withRouter(connect(
    mapStateToProps,
    {
        findDriversNearby,
        sendTripRequest,
        getDriversById,
        updateRiderLocation,
        cancelTripRequest,
        confirmTripRequest
    }
)(DirectionMap))
