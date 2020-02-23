import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
import './DirectionMap.css'
import './RiderHomePage.css'
import {openModal} from "../../actions";
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import placeholder from 'assets/img/placeholder.jpg'
import IconArrowRight from 'assets/img/arrow-right.png'
import IconMessage from 'assets/img/message-square.svg'
import IconPhone from 'assets/img/phone.svg'
import DriverProfilePage from '../driver/DriverProfilePage'
import RiderTripReviewPage from '../rider/RiderTripReviewPage'
import * as helper from "../../utils/helpers";
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

import {
    findDriversNearby,
    getDriversById,
    cancelTripRequest,
    confirmTrip,
    updateThisRiderLocation,
    riderCancelRequest,
    riderCancelTrip,
    riderRequestTrip,
} from '../../actions'
import IconButton from '@material-ui/core/IconButton'
import { withRouter } from 'react-router'
import CarIcon from "../../assets/img/icons/icons-car-front.svg";
import {socketInit, getSocket} from '../../utils/socketConnection'
let socket
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class RiderHomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: [-122.431297, 37.7749],      // used for geolocation
            startLocation: [-122.431297, 37.7749],
            endLocation: null,
            startLocationAddress: null,
            endLocationAddress: null,
            distance: 0,
            longitude: 0,
            searchResultLayer: null,
            loadingMap: true,
            response: false,
            showEstimate: false,
            requestDetails: null,
            requestingRide: false,
            tripStatus: 'standby',
            tripFare: 0,
            tripId: null,
            acceptedDrivers: [],
            currentDriver: null,
            headerMessage: '',
        }
        this.priceInput = React.createRef()
        this.map = null
        this.directions = null
        this.geolocate = null
        this.acceptedDriversMarkerMap = new Map()
    
        // const rider = this.props.loggedInUser;
        // const token = localStorage.getItem('token')
         if (!socket) {
             socketInit()
             socket = getSocket()
         }
    }
    
    //========================================
    //  Happy Path - Requests and Trips
    //========================================
    
    /*  Step 0. - Update Rider Location on Geolocation Results
    /*  Called when geolocation result is returned
     */
    updateRiderLocation = ()=>{
        const {location} = this.state
        
        this.props.updateThisRiderLocation(socket,
            {
                location,
            })
    }
    
    /**
     *   Step 1. - Send Ride Requests to Drivers Nearby
     *   Handler for requesting ride in the standby stage
     */
    handleRequestRide = () => {
        // const rider = this.props.loggedInUser;
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
            endLocationAddress: this.state.endLocationAddress,
            distance: this.state.distance,
            duration: this.state.duration,
            tripFare: this.state.tripFare,
            // riderId:rider._id,
            // riderUsername:rider.username
        }
    
        this.props.riderRequestTrip(socket, {
            ...tripRequest,
        })
    
        this.props.history.push('/rider/requesting')
    }
    
    /**
     *  Step 2. - Trip Offered by Drivers
     * @param data
     */
    onTripAcceptedByDriver = (data)=>{
        localStorage.setItem('requestDetails', JSON.stringify(data))
        this.setState({
            showEstimate: true,
            requestDetails: data,
            acceptedDrivers: [data.driver],
        })
        console.log(
            'acceptedDrivers' , this.state.acceptedDrivers
        )
        console.log(
            'onTripAcceptedByDriver \n',
            this.acceptedDriversMarkerMap.get(data.driver.username)
        )
        this.props.history.push('/rider/drivers-found')
    }
    
    /**
     *  Step 3. - Rider Send Confirmation to Driver
     * @param idx
     */
    handleConfirmRequest = idx => {
        const driver = this.state.acceptedDrivers[idx]
        // console.log('driver', driver)
        // localStorage.setItem('currentDriver', JSON.stringify(driver))
        
        this.props.confirmTrip(socket, {
            driverId: driver._id,
            driverUsername: driver.username,
            ...this.state.requestDetails,
        })
        
        this.setState({
            showEstimate: false,
            currentDriver: driver,
        })
        
        this.props.history.push('/rider/confirmed')
    }
    
    /**
     *  Step 4. - Trip Started By Driver
     * @param data
     */
    onTripStartedByDriver = (data)=>{
        localStorage.setItem('requestDetails',JSON.stringify(data))
    
        this.setState({
            showEstimate: true,
            requestDetails: data,
            acceptedDrivers: [...this.state.acceptedDrivers, data.driver],
        }) //Save request details
        console.log(
            'Driver is coming to pickyou up \n' + JSON.stringify(data)
        )
        this.props.history.push('/rider/trip-started')
    }
    
    /**
     *  Step 5. - Trip Ended By Driver
     * @param data
     */
    onTripEndedByDriver = (data)=>{
        this.setState({ tripId: data })
		const requestDetails = localStorage.setItem('requestDetails', data)
        console.log('requestDetails', requestDetails.rider)
        
        const tripData = {
            driverId: requestDetails.driverId,
            riderId:  requestDetails.rider._id,
            tripId:   requestDetails._id
        }
        
        this.props.openModal({shouldOpen:true, component:RiderTripReviewPage, data:tripData});
        this.props.history.push('/rider/trip-ended')
        console.log('TRIP_ID \n' + JSON.stringify(data))
        this.resetTrip()
    }
    
    //============================================
    //  EDGE CASES  -  CANCELLATIONS & OFFLINE
    //============================================
    
    /**
     *  CANCEL TYPE   -  Rider Send Cancel Trip Request
     * @param data
     */
    handleCancelRideRequest = () => {
        this.resetTrip()
        
        this.props.riderCancelRequest(socket, {
            // rider: this.props.loggedInUser,////getLocalStore('user'),
            tripId: this.state.tripId,
        })
        
        this.setState({
            requestingRide: false,
            endLocation: null,
            tripFare:0,
            acceptedDrivers: [],
        })
        this.props.cancelTripRequest()
        this.props.history.push('/rider/standby')
    }
    
    /**
     *  CANCEL TYPE  -  Rider Cancel Trip
     * @param data
     */
    handleCancelTrip = () => {
        this.resetTrip()
        this.props.riderCancelTrip(socket, {
            // rider: this.props.loggedInUser,
            tripId: this.state.tripId,
        })
        this.setState({ acceptedDrivers: [] })
        this.props.history.push('/rider/standby')
    }
    
    onTripCanceledByRider = ()=>{
        console.log('RIDER_TRIP_CANCELED! \n')
        this.resetTrip()
        this.setState({
            acceptedDrivers: [],
        })
        this.props.history.push('/rider/standby')
    }
    
    /**
     *  CANCEL TYPE  -  Trip Cancelled by Driver
     * @param data
     */
    onTripCanceledByDriver = ()=>{
        console.log('RIDER_TRIP_CANCELED! \n')
        this.resetTrip()
    
        this.setState({
            acceptedDrivers: [],
        })
        this.props.history.push('/rider/standby')
    }
    
    /**
     *  CANCEL TYPE 4.  -  Driver gone offline
     * @param data
     */
    onDriverGoOffline = (data)=>{
        console.log('DRIVER_GO_OFFLINE! \n')
        this.resetTrip()
        const newArr = this.state.acceptedDrivers.filter(
            driver => driver.username !== data.username
        )
        this.setState({
            acceptedDrivers: newArr,
        })
    
        this.acceptedDriversMarkerMap.get(data.username) &&
        this.acceptedDriversMarkerMap.get(data.username).remove()
    }
    /**
     *  RECEIVE UPDATE FROM DRIVER -  Driver come online
     * @param data
     */
    onDriverGoOnline = ({driver})=>{
        console.log('DRIVER_GO_ONLINE! \n', driver)
        
    }
    
    onReceiveError = (err)=>{
        console.log('Receive Error',err)
        
    }
    
    bindListeners(){
        socket.on('TRIP_ACCEPTED_BY_DRIVER', this.onTripAcceptedByDriver)
        socket.on('TRIP_STARTED_BY_DRIVER', this.onTripStartedByDriver)
        socket.on('TRIP_CANCELED_BY_RIDER', this.onTripCanceledByRider)
        socket.on('TRIP_CANCELED_BY_DRIVER', this.onTripCanceledByDriver)
        socket.on('TRIP_REQUESTED_BY_RIDER', this.onTripRequestedByRider)
        socket.on('TRIP_ENDED_BY_DRIVER', this.onTripEndedByDriver)
        socket.on('DRIVER_GO_OFFLINE', this.onDriverGoOffline)
        socket.on('DRIVER_GO_ONLINE', this.onDriverGoOnline)
        socket.on('error', this.onReceiveError)
    }
    
    unbindListeners = ()=>{
        socket.off('TRIP_ACCEPTED_BY_DRIVER')
        socket.off('TRIP_STARTED_BY_DRIVER')
        socket.off('TRIP_CANCELED_BY_RIDER')
        socket.off('TRIP_CANCELED_BY_DRIVER')
        socket.off('TRIP_REQUESTED_BY_RIDER')
        socket.off('DRIVER_GO_OFFLINE')
        socket.off('error')
        console.log('unbindListeners')
    }
    // addMarkers = () => {
    // 	geojson.features.forEach((marker)=> {
    // 		this.addMarker()
    // 	}
    // }

    componentDidMount() {
        // if (!rider) this.props.history.push('/')
        this.bindListeners()
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                startLocation: [
                    position.coords.longitude,
                    position.coords.latitude,
                ],
                location: [position.coords.longitude, position.coords.latitude],
                loadingMap: false,
            })
    
            this.updateRiderLocation()

            this.map = new mapboxgl.Map({
                container: this.mapContainer, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
                style: 'mapbox://styles/mapbox/streets-v9',
                center: this.state.startLocation,
                zoom: 13,
            })

            this.map.on('click', 'places', e => {
                console.log()
                var coordinates = e.features[0].geometry.coordinates.slice()
                var description = e.features[0].properties.description
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(this.map)
            })

            this.map.on('mouseenter', 'places', () => {
                this.map.getCanvas().style.cursor = 'pointer'
                console.log('mouseenter')
            })

            this.map.on('mouseleave', 'places', () => {
                this.map.getCanvas().style.cursor = ''
                console.log('mouseleave')
            })

            this.map.on('load', () => {
                this.directions.setOrigin(this.state.startLocation)
                var riderGeojson = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            position.coords.longitude,
                            position.coords.latitude,
                        ],
                    },
                    properties: {
                        title: 'Your are here',
                        description:
                            '<h3><strong>Make it Mount Pleasant</strong></h3><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a',
                    },
                }

                const riderMarker = this.addMarker(
                    'marker',
                    helper.getUserId,
                    riderGeojson
                )
            })

            this.directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'imperial',
                profile: 'mapbox/driving',
                interactive: false,
            })

            this.directions.on('origin', e => {
                let startInput = document.querySelectorAll(
                    '.mapbox-directions-origin input'
                )[0]
                this.setState({
                    startLocation: e.feature.geometry.coordinates,
                    startLocationAddress: startInput.value,
                })
            })

            this.directions.on('destination', e => {
                let destInput = document.querySelectorAll(
                    '.mapbox-directions-destination input'
                )[0]
			
                this.setState({
                    endLocation: e.feature.geometry.coordinates,
                    endLocationAddress: destInput.value,
                })
    
                if(this.priceInput && this.priceInput.current){
                    this.priceInput.current.focus();
                }
			})

            this.directions.on('route', e => {
                console.log('e', e)
                if (e.route && e.route.length) {
                    const { distance, legs, duration } = e.route[0]
                    this.setState({
                        endLocationAddress: legs[0].summary,
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

        })
    }

    componentWillUnmount = () => {
        this.unbindListeners();
    
        if (this.map) {
            setTimeout(() => this.map.remove(), 3000)
        }
    }
    
    addMarker = (markerStyle, markerId, marker) => {
        // marker.features.forEach((marker)=> {
        var el = document.createElement('div')
        el.className = markerStyle
        el.id = markerId

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            marker.properties.description
        )

        return new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(popup)
            .addTo(this.map)
    }

    resetTrip = () => {
        helper.removeTrip()
        // removeLocalStore('currentDriver')
        if (this.directions){
            this.directions.removeRoutes()
            this.directions.setOrigin(this.state.startLocation)
        }
        const destinationInput = document.querySelectorAll(".mapbox-directions-destination input")[0]
        if (destinationInput) {
            destinationInput.value = ''
        }
        
        this.state.acceptedDrivers = [];
        
        if ( this.map) {
            this.map.zoom = 15
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    loadDriverProfile = driver => {
        console.log('driver', driver)
        this.props.getDriversById(driver._id).then(() => {
            console.log('getDriverByIdeSuccess', driver._id)
            this.props.openModal({shouldOpen:true, component:DriverProfilePage});
        })
    }

    handleKeyPress = e => {
        if(e.which === 13){
           this.handleRequestRide()
        }
    }
   
    
    getStatePath = (path) => {
        return path.split('/rider/')[1]
    }

    render() {
        const path = this.getStatePath(this.props.location.pathname)
        const {
            acceptedDrivers,
            currentDriver,
            headerMessage,
        } = this.state
        
        let requestDetails
            requestDetails =JSON.parse(localStorage.getItem('requestDetails')) || null  //JSON.parse( localStorage.getItem('requestDetails')) || null

        const statusPanel = () => {
            switch (path) {
                case 'standby':
                    return (
                        <div className={'status-panel status-panel__standby'}>
                            <h1 className={`status-panel__header`}>
                                {!this.state.endLocation ? `Where are you going?` : 'Name your fare!'}
                            </h1>
                          
                            <div
                                className={'driver-name-your-fare-container'}
                                css={css`
                                    display: ${this.state.endLocation
									? 'flex'
									: 'none'};
                                `}
                            >
                                <input
                                    ref={this.priceInput}
                                    pattern="[0-9]"
                                    name={'tripFare'}
                                    type={'text'}
                                    placeholder={'$ 0'}
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleKeyPress}
                                />
                                <button
                                    className={
                                        'driver-name-your-fare__button'
                                    }
                                    disabled={!this.state.tripFare}
                                    onClick={e => this.handleRequestRide(e)}
                                    onKeyPress={e => this.handleKeyPress(e)}
                                >
                                    REQUEST
                                </button>
                            </div>
                        </div>
                    )
                case 'requesting':
                    return (
                        <div className={'status-panel'}>
                            <h1 className={`status-panel__header`}>
                                Quote Submitted to Drivers
                            </h1>
                            <Loader
                                type="Rings"
                                color="#3ACCE1"
                                height={100}
                                width={100}
                            />
                            <button
                                className={'request-ride-button'}
                                onClick={this.handleCancelRideRequest}
                            >
                                CANCEL REQUEST
                            </button>
                        </div>
                    )
                case 'drivers-found':
                    return (
                        <div className={'status-panel'}>
                            <h1 className={`status-panel__header`}>Drivers found. Accept offer?</h1>
                            {acceptedDrivers &&
                                    acceptedDrivers.map((driver, idx) => {
                                        return (
                                            <div
                                                className="trip-destination-container"
                                                key={idx}
                                                 >
                                                <div className={"icon-box"}>
                                                    <img className={"icon-box-image"}
                                                            src={
                                                                driver.avatar ||
                                                                placeholder
                                                            } alt={"driver"} />
                                                    <h3>2 miles away</h3>
                                                </div>
                                                <div className={"icon-box"}>
                                                    <img src={CarIcon} alt={"rider icon"}/>
                                                    <h3>BMW</h3>
                                                </div>
                                                <div className={"trip-destination-left"}>
                                                    <h3 className={"text-blue"}>{driver.username}</h3>
                                                    <h3 className={"text-blue"}>{driver.rating} star</h3>
                                                </div>
                                                    <button
                                                        className={
                                                            'driver-item-accept-button rider'
                                                        }
                                                        onClick={() =>
                                                            this.handleConfirmRequest(
                                                                idx
                                                            )
                                                        }
                                                    >
                                                        ACCEPT
                                                    </button>
                                                <img src={IconArrowRight}
                                                    alt={"right arrow icon"}
                                                    onClick={e =>
                                                        this.loadDriverProfile(
                                                            driver
                                                        )
                                                    }
                                                >
                                                </img>
                                            </div>
                                        )
                                    })}
                            <button
                                className={'request-ride-button bordered'}
                                onClick={this.handleCancelRideRequest}
                            >
                                CANCEL REQUEST
                            </button>
                        </div>
                    )
                case 'confirmed':
                    return (
                        <div className={'status-panel'}>
                            <h1 className={`status-panel__header`}>
                                Your Driver <span className={"text-blue"}>{currentDriver && currentDriver.username}</span> is on the way
                            </h1>
                                {currentDriver && (
                                    <div
                                        className="trip-destination-container"
                                    >
                                        <div className={"icon-box bordered"}>
                                            <img className={"icon-box-image"}
                                                 src={
                                                     currentDriver.avatar ||
                                                     placeholder
                                                 } alt={"driver"} />
                                            <h3>2 miles away</h3>
                                        </div>
                                        <div className={"icon-box bordered" }>
                                            <img src={CarIcon} alt={"rider icon"}/>
                                            <h3>BMW</h3>
                                        </div>
                                        <div
                                            className={
                                                'driver-item-buttons-list'
                                            }
                                        >
                                            <div
                                                className={
                                                    'action-icon-button-bar'
                                                }
                                            >
                                                <IconButton
                                                    className={
                                                        'driver-item-icon-button'
                                                    }
                                                >
                                                    <img src={IconMessage} alt={"message icon"}/>
                                                </IconButton>
                                                <IconButton
                                                    className={
                                                        'driver-item-icon-button'
                                                    }
                                                >
                                                    <img src={IconPhone}  alt={"phone icon"}/>
                                                </IconButton>
                                            </div>
                                        </div>
                                        <img src={IconArrowRight}
                                             alt={"right arrow icon"}
                                             onClick={e =>
                                                 this.loadDriverProfile(
                                                     currentDriver
                                                 )
                                             }
                                        >
                                        </img>
                                    </div>
                                )}
                            <button
                                className={'request-ride-button bordered'}
                                onClick={e => this.handleCancelTrip()}
                            >
                                CANCEL TRIP
                            </button>
                        </div>
                    )
                case "trip-started": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>Trip Started. <span className={"text-blue"}>On your Way to Destination</span></h1>
                        <div className={"trip-destination-container"}>
                            <div className={"icon-box"}>
                                <img className={"icon-box-image"} src={currentDriver.avatar||  placeholder}  alt={"rider"} />
                                <h3> {`${currentDriver.rating} `}stars</h3>
                            </div>
                            <div className={"icon-box"}>
                                <img src={CarIcon} alt={"rider icon"}/>
                                <h3>24 miles</h3>
                            </div>
                            <div className={"trip-destination-left"}>
                                <h1>Destination</h1>
                                <h2>{requestDetails.endLocationAddress}</h2>
                                <span className={"tag white"}>{requestDetails.duration} mins</span>
                                <span className={"tag blue"}>{requestDetails.distance} mi</span>
                                <span className={"tag pink"}>${requestDetails.tripFare}</span>
                            </div>
                        </div>
            
                        <button className={'request-ride-button'} >
                            <IconButton className={'driver-item-icon-button'}>
                                <img src={IconPhone} alt={"phone icon"} />
                            </IconButton> Call Support</button>
                    </div>
                )
                case 'trip-ended':
                    return (
                        <div className={'status-panel'}>
                            <h1 className={`status-panel__header`}>
                                {headerMessage}
                            </h1>
                            <div className="drivers-nearby-container-list"></div>
                            <button
                                className={'request-ride-button bordered'}
                                onClick={this.handleCancelRideRequest}
                            >
                                CANCEL REQUEST
                            </button>
                        </div>
                    )
                default:
                    return <h1>No project match</h1>
            }
        }

        return (
            <div className="map-container ">
                {this.state.loadingMap ? (
                    <div className={'pageLoader'}>
                        <Loader
                            type="ThreeDots"
                            color="white"
                            height="50"
                            width="50"
                        />
                        <h3>Loading...</h3>
                    </div>
                ) : (
                    <div
                        className="map-wrapper rider"
                        style={{ position: 'relative', display: 'flex' }}
                    >
                        <div
                            ref={el => (this.mapContainer = el)}
                            className={`map ${path !== 'standby' &&
                                'hide-direction'}`}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                        {statusPanel()}
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = ({ riderReducer, tripReducer }) => ({
    findNearbyDriverStarted: riderReducer.findNearbyDriverStarted,
    driversNearby: riderReducer.driversNearby,
    findNearbyDriverMessage: riderReducer.findNearbyDriverMessage,
    tripStatus: riderReducer.tripStatus,
    submitDriverReviewSuccessMessage:
    riderReducer.submitDriverReviewSuccessMessage,
    shouldResetTrip:tripReducer.shouldResetTrip,
    loggedInUser: riderReducer.loggedInUser,
})


export default withRouter(
    connect(
        mapStateToProps,
        {
            findDriversNearby,
            getDriversById,
            riderRequestTrip,
            updateThisRiderLocation,
            riderCancelRequest,
            confirmTrip,
            riderCancelTrip,
            cancelTripRequest,
            openModal,
        }
    )(RiderHomePage)
)
