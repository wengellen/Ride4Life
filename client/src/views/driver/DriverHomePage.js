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
    driverGoOnline,
    driverGoOffline,
    acceptTrip,
    driverCancelTrip,
} from '../../actions'
import IconButton from "@material-ui/core/IconButton";
import CarIcon from '../../assets/img/icons/icons-car-front.svg'
import RiderIcon from '../../assets/img/icons/rider.svg'
// import socket from "../../utils/socketConnection";
import io from "socket.io-client"
import {Avatar} from "@material-ui/core";
import placeholder from 'assets/img/placeholder.jpg'
import IconMessage from 'assets/img/message-square.svg'
import IconPhone from 'assets/img/phone.svg'

let socket
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN


class DriverHomePage extends Component {
    constructor(props) {
        super(props);
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
        this.mapContainer = React.createRef();
        this.driver=JSON.parse(localStorage.getItem('user'))
        const endpoint = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : `https://ride4lifer.herokuapp.com`
    
        socket = io.connect(endpoint)
    
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
                headerMessage:"You have 1 request. Accept Now?",
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
        
        socket.on('TRIP_CONFIRMED', data => {
            const requestDetails = data
            console.log('requestDetails', data)
            var riderGeojson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: requestDetails.location.coordinates
                    },
                    properties: {
                        title: 'Pickup Location',
                        description: '<h3><strong>Pickup Location</strong></h3><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a'
                    }
                }]
            }
            riderGeojson.features.forEach((marker)=> {
                var el = document.createElement('div');
                el.className = 'riderMarker';
                
                const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(marker.properties.description)
                console.log('marker.geometry.coordinates',marker.geometry.coordinates)
                new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(popup)
                .addTo(this.map);
            });
            
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
            
            this.resetTrip()
            
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
            
            this.resetTrip()
            
            localStorage.removeItem('requestDetails')
            document.querySelectorAll('.driver-map')[0].classList.add('hide-direction')
            this.props.history.push('/driver-home/standby')
        })
    }
    
    componentDidMount() {
        const driver = JSON.parse(localStorage.getItem('user'))
        navigator.geolocation.getCurrentPosition(position => {
            var driverGeojson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [position.coords.longitude, position.coords.latitude]
                    },
                    properties: {
                        title: 'Your are here',
                        description: '<h3><strong>You are here</strong></h3><p>2398 Walters way</p>'
                    }
                }]
            }
            const coordinates = [
                position.coords.longitude,
                position.coords.latitude,
            ]
            
            this.props.updateDriverLocation(socket,  {
                coordinates,
                role: 'driver',
                username: driver.username,
                driver: driver,
            })
            console.log('componentDidMount is called')
            this.setState({
                location: [position.coords.longitude, position.coords.latitude],
            })
            
            this.map = new mapboxgl.Map({
                container: this.mapContainer.current, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 15,
            })
            driverGeojson.features.forEach((marker)=> {
                var el = document.createElement('div');
                el.className = 'driverMarker';
                el.id = 'driverMarker';
                
                const popup = new mapboxgl.Popup({ offset: 40 })
                .setHTML(marker.properties.description)
                
                new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(popup)
                .addTo(this.map);
    
                console.log('el',el)
            });
            
            // Directions
            this.directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'imperial',
                profile: 'mapbox/driving',
                interactive:false
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
                const instruction = document.querySelectorAll(".mapbox-directions-instructions")[0]
                // instruction && (document.querySelectorAll(".mapbox-directions-instructions")[0].style.display = "block")
            })
            
            this.map.on('load', () => {
                this.startInput = document.querySelectorAll(".mapbox-directions-origin input")[0]
                this.destInput = document.querySelectorAll(".mapbox-directions-destination input")[0]
                console.log("document.querySelectorAll(\".mapbox-directions-instructions\")", document.querySelectorAll(".mapbox-directions-instructions"))
            })
            
            this.map.addControl(this.directions, 'top-left')
            this.map.addControl(new mapboxgl.NavigationControl());
        })
    }
    
    componentWillUnmount = () => {
        if (this.map) {
            setTimeout(() => this.map.remove(), 3000)
        }
    }
    
    resetTrip = () => {
        this.directions.removeRoutes();
        document.querySelectorAll(".mapbox-directions-destination input")[0].value = ''
        this.map.zoom = 15
    }
    
    cancelTrip = (e) => {
        this.props.driverCancelTrip(socket, {
            driver: JSON.parse(localStorage.getItem('user')),
            tripId:this.state.tripId
        })
        
        this.startInput.value = ""
        this.destInput.value = ""
    }
    
    handleStartTrip = (e) => {
        e.target.style.display = "none"
        this.setState({
            driverStatus:"tripStarted",
        })
        const requestDetails = JSON.parse( localStorage.getItem('requestDetails'))
        this.directions.setOrigin(requestDetails.startLocation.coordinates)
        this.directions.setDestination(requestDetails.endLocationAddress)
        document.querySelectorAll('.driver-map')[0].classList.remove('hide-direction')
    
        setTimeout(() => {
            let summaryHeader = document.querySelectorAll('.mapbox-directions-route-summary')[0]
            let btn = document.createElement('button');
            btn.className = 'showDirectionBtn'
            btn.textContent = "Show Direction"
            btn.addEventListener('click', function (e) {
                e.stopPropagation()
                let dirInstruction = document.querySelectorAll('.mapbox-directions-route-summary + .mapbox-directions-instructions')[0]
                if (dirInstruction.style.display === 'none'){
                    dirInstruction.style.display = 'block'
                    this.textContent = "Hide Direction"
                } else{
                    dirInstruction.style.display = 'none'
                    this.textContent = "Show Direction"
                }
            })
            summaryHeader.appendChild(btn)
        },1000)
        this.props.history.push('/driver-home/pickup')
    }
    
    
    handleDriveToUser = (e) => {
       console.log("handleDriveToUser")
        this.setState({
            driverStatus:"pickup",
        })
        const requestDetails = JSON.parse( localStorage.getItem('requestDetails'))
        this.directions.setOrigin(this.state.location)
        this.directions.setDestination(requestDetails.startLocation.coordinates)
        this.startInput.value = "Your Location"
        document.querySelectorAll('.driver-map')[0].classList.remove('hide-direction')
        
        setTimeout(() => {
            document.querySelectorAll('.directions-control .mapbox-directions-instructions')[0].style.display = "none"
            let summaryHeader = document.querySelectorAll('.mapbox-directions-route-summary')[0]
            let btn = document.createElement('button');
            btn.className = 'showDirectionBtn'
            btn.textContent = "Show Direction"
            btn.addEventListener('click', function () {
                let dirInstruction = document.querySelectorAll('.mapbox-directions-route-summary + .mapbox-directions-instructions')[0]
                if (dirInstruction.style.display === 'none'){
                    dirInstruction.style.display = 'block'
                    this.textContent = "Hide Direction"
                } else{
                    dirInstruction.style.display = 'none'
                    this.textContent = "Show Direction"
                }
            
            })
            summaryHeader.appendChild(btn)
        },3000)
     
        this.props.history.push('/driver-home/pickup')
        
    }
    
    handleAcceptTrip = (e) => {
        console.log('ACCEPT_TRIP', )
        if (e.target.disabled ) return
        
        this.props.acceptTrip(socket, {
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
        
        this.props.driverGoOnline(socket,{
            driver: JSON.parse(localStorage.getItem('user'))
        })
        
        this.setState({
            driverStatus:"standby",
            headerMessage:"Finding Trip for you..."
        })
        this.props.history.push('/driver-home/standby')
    }
    
    handleDriverGoOffline = () => {
        console.log('DRIVER_GO_OFFLINE', )
        this.props.driverGoOffline(socket, {
            driver: JSON.parse(localStorage.getItem('user'))
        } )
        this.setState({driverStatus:"offline"})
        // socket.disconnect()
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
                        <h1 className={`status-panel__header`}>Ready to drive?</h1>
                        <p>
                        </p>
                        <button className={'request-ride-button'} onClick={this.handleDriverGoOnline}>GO ONLINE</button>
                    </div>
                )
                case "standby": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>{headerMessage}</h1>
                        <Loader type="Rings" color="#3ACCE1" height={100} width={100} />
                        <button  className={'request-ride-button'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</button>
                    </div>
                )
                case "requestIncoming": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>{headerMessage}</h1>
                        <div className={"trip-destination-container"}>
                            <div className={"icon-box"}>
                                <img className={"icon-box-image"} src={requestDetails.rider.avatar||  placeholder}  alt={"rider"} />
                                <h3> {`${requestDetails.rider.rating} `}stars</h3>
                            </div>
                            <div className={"icon-box"}>
                                <img src={CarIcon} alt={"rider icon"}/>
                                <h3>24 miles</h3>
                            </div>
                            <div className={"trip-destination-left"}>
                                <h1>Destination</h1>
                                <h2>{requestDetails.endLocationAddress}</h2>
                            </div>
                            <button className={"driver-item-accept-button"}
                                    onClick={(e)=> this.handleAcceptTrip(e)}>
                                <h2>${requestDetails.tripFare}</h2>
                                <h3>OFFER</h3>
                            </button>
                        </div>
                        <button  className={'request-ride-button'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</button>
                    </div>
                )
                
                case "waitingForConfirmation": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>{headerMessage}</h1>
                        <div className={"trip-destination-container"}>
                            <div className={"icon-box"}>
                                <img className={"icon-box-image"} src={requestDetails.rider.avatar||  placeholder}  alt={"rider"} />
                                <h3> {`${requestDetails.rider.rating} `}stars</h3>
                            </div>
                            <div className={"icon-box"}>
                                <img src={CarIcon} alt={"rider icon"}/>
                                <h3>24 miles</h3>
                            </div>
                            <div className={"trip-destination-left"}>
                                <h1>Destination</h1>
                                <h2>{requestDetails.endLocationAddress}</h2>
                            </div>
                            <button className={"driver-item-accept-button"}>
                                <Loader type="ThreeDots" color="#2A2E43" height={20} width={40} />
                            </button>
                        </div>
                        <button  className={'request-ride-button'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</button>
                    </div>
                )
                case "confirmed": return (
                    <div className={'status-panel'}>
                            <h1 className={`status-panel__header inline`}>Trip Confirmed. Drive to rider</h1>
                            <div className={'action-icon-button-bar right'}>
                                <IconButton className={'driver-item-icon-button'}>
                                    <img src={IconMessage}/>
                                </IconButton>
                                <IconButton className={'driver-item-icon-button'}>
                                    <img src={IconPhone} />
                                </IconButton>
                            </div>
                        <div className={"trip-destination-container"}>
                            <div className={"icon-box bordered"}>
                                <img className={"icon-box-image"} src={requestDetails.rider.avatar||  placeholder}  alt={"rider"} />
                                <h3> {`${requestDetails.rider.rating} `}stars</h3>
                            </div>
                            <div className={"icon-box bordered"}>
                                <img src={CarIcon} alt={"rider icon"}/>
                                <h3>24 miles</h3>
                            </div>
                            <div className={"trip-destination-left"}>
                                <h1>Destination</h1>
                                <h2>{requestDetails.endLocationAddress}</h2>
                                {/*<span className={"tag pink"}>${requestDetails.tripFare}</span>*/}

                            </div>
                            
                            <button className={"driver-item-accept-button "}
                                    onClick={this.handleDriveToUser}>
                                    Pick Up Rider
                            </button>
                        </div>
                        <button className={'request-ride-button'} onClick={this.cancelTrip}>CANCEL TRIP</button>
                    </div>
                )
                case "pickup": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>Trip Started</h1>
                        <div className={"trip-destination-container"}>
                            <div className={"icon-box"}>
                                <img className={"icon-box-image"} src={requestDetails.rider.avatar||  placeholder}  alt={"rider"} />
                                <h3> {`${requestDetails.rider.rating} `}stars</h3>
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
                            <button className={"driver-item-accept-button"} onClick={this.handleStartTrip}>
                                START TRIP
                            </button>
                        </div>
                        <button className={'request-ride-button'} onClick={this.cancelTrip}>CANCEL TRIP</button>
                        {/*<button color="info" className="main" onClick={this.handleStartTrip}>START TRIP</button>*/}
                    </div>
                )
                case "trip-ended": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>{headerMessage}</h1>
                        <div className="drivers-nearby-container-list">Trip Ended</div>
                    </div>
                )
                default:      return <h1>No match</h1>
            }
        }
        return (
            <div className="map-wrapper ">
                <div className="map-container driver">
                    <div
                        className="map-wrapper driver"
                        style={{ position: 'relative', display: 'flex' }}>
                        <div
                            ref={ this.mapContainer}
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
    { updateDriverLocation,
        driverGoOnline,
        driverGoOffline,
        acceptTrip,
        driverCancelTrip,
    }
)(DriverHomePage);

