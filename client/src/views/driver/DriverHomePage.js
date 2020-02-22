import React, { Component } from "react";
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
import './DriverHomePage.css' // Updating node module will keep css up to date.
import Loader from 'react-loader-spinner'
import * as helper from "../../utils/helpers";
import { connect } from 'react-redux'
import {
    updateDriverLocation,
    driverGoOnline,
    driverGoOffline,
    acceptTrip,
    driverCancelTrip,
    driverStartTrip,
    driverEndTrip,
    openModal,
} from '../../actions'
import IconButton from "@material-ui/core/IconButton";
import CarIcon from '../../assets/img/icons/icons-car-front.svg'
import placeholder from 'assets/img/placeholder.jpg'
import IconMessage from 'assets/img/message-square.svg'
import IconPhone from 'assets/img/phone.svg'
import DriverTripReviewPage from "./DriverTripReviewPage";
import {socketInit} from '../../utils/socketConnection'
let socket
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class DriverHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        
            location: [], // used for geolocation
            
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
        this.map = null
        this.directions =null
        this.startInput = null
        this.destInput = null
        this.instruction = null
        this.mapContainer = React.createRef();
        
        // const driver = getLocalStore('user');//SON.parse(localStorage.getItem('user'))
        // const driver = JSON.parse(localStorage.getItem('user'))
        
        //const token =  localStorage.getItem('token')  //localStorage.getItem('token')
        // const token =  localStorage.getItem('token')  //localStorage.getItem('token')
        // console.log("socketInit   driver",driver)
        socket = socketInit(helper.getToken())
    }
    
    //========================================
    //  Happy Path - Requests and Trips
    //========================================
    
    /*  Step 0. - Update Driver Location on Geolocation Results
    /*  Called when geolocation result is returned
     */
    updateDriverLocation = ()=>{
        const {location} = this.state
        // const driver = JSON.parse(localStorage.getItem('user'))//.parse(localStorage.getItem('user'))
        // console.log("updateDriverLocation - driver",driver)
        this.props.updateDriverLocation(socket,
            {
                location,
            })
    }
    
    /**
     *   Step 1. -  Driver go Online
     *   onClick event listener
     */
    handleDriverGoOnline = () => {
        console.log('DRIVER_GO_ONLINE', )
    
        this.bindListeners()
        
        const driver =  JSON.parse(localStorage.getItem('user'))
        this.props.driverGoOnline(socket)
       
        this.props.history.push('/driver/standby')
    }
    
    
    /**
     *   Step 2. - Receive Ride Request from Rider
     */
    onTripRequestedByRider = (data)=>{
            const requestDetails = data
            console.log('onTripRequestedByRider')
            localStorage.setItem('requestDetails', JSON.stringify(data))
            this.setState({
                driverStatus:"requestIncoming",
                requestDetails: data,
            })
            console.log(
                'You have a new request! \n' +
                JSON.stringify(requestDetails)
            )
            this.props.history.push('/driver/requestIncoming')
    
    }
    
    /**
     *   Step 3. - Accept Trip
     *   onClick event listener
     */
    handleAcceptTrip = (e) => {
        console.log('ACCEPT_TRIP', )
        if (e.target.disabled ) return
        this.props.acceptTrip(socket, {
            ...this.state.requestDetails,
        })
        
        this.setState({
            driverStatus:"waitingForConfirmation",
        })
        
        this.props.history.push('/driver/waitingForConfirmation')
    }
    
    /**
     *   Step 4. - Receive Trip Confirmation from Rider
     *
     */
    onTripConfirmedByRider = (data)=>{
        const requestDetails = data
        localStorage.setItem('requestDetails', JSON.stringify(data))
    
        // console.log('requestDetails', data)
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
            tripId:data._id
        }) //Save request details
        
        console.log(
            'Rider has accept your service! \n' +
            JSON.stringify(requestDetails)
        )
        
        this.props.history.push('/driver/confirmed')
    }
    
    /**
     *   Step 5. - Drive to Rider
     *   onClick event listener
     */
    handleDriveToUser = (e) => {
        console.log("handleDriveToUser")
        this.setState({
            driverStatus:"pickup",
        })
        // const requestDetails = getLocal('requestDetails')
        const requestDetails = JSON.parse(localStorage.getItem('requestDetails'))//JSON.parse( localStorage.getItem('requestDetails'))
        this.directions.setOrigin(this.state.location)
        this.directions.setDestination(requestDetails.startLocation.coordinates)
        this.startInput.value = "Your Location"
        document.querySelectorAll('.driver-map')[0].classList.remove('hide-direction')
        
        setTimeout(() => {
            const direcitonInstruction =  document.querySelectorAll('.directions-control .mapbox-directions-instructions')[0]
            if (direcitonInstruction){
                direcitonInstruction.style.display = "none"
            }
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
            if (summaryHeader){
                summaryHeader.appendChild(btn)
            }
        },3000)
        
        // send heart beat to check location proximety
        this.props.history.push('/driver/pickup')
    }
    
    
    /**
     *   Step 6. - Start Trip
     *   onClick event listener
     */
    handleStartTrip = (e) => {
        this.setState({
            driverStatus:"tripStarted",
        })
        
        // const requestDetails = getLocal('requestDetails')
        const requestDetails =JSON.parse(localStorage.getItem('requestDetails')) //JSON.parse( localStorage.getItem('requestDetails'))
        console.log("requestDetails",requestDetails)
        this.directions.setOrigin(requestDetails.startLocation.coordinates)
        this.directions.setDestination(requestDetails.endLocationAddress)
        document.querySelectorAll('.driver-map')[0].classList.remove('hide-direction')
        
        // Add Show Direction
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
        
        
        let checkSummaryHeaderInterval =  setInterval(()=>{
            if (summaryHeader){
                summaryHeader.appendChild(btn)
                clearInterval(checkSummaryHeaderInterval);
            }
        },1000)
        
        this.props.driverStartTrip(socket, {
            ...requestDetails
        })
        this.props.history.push('/driver/trip-started')
    }
    
    /**
     *   Step 7. - End Trip
     *   onClick event listener
     */
    handleEndTrip = (e) => {
        const requestDetails =JSON.parse(localStorage.getItem('requestDetails')) //JSON.parse( localStorage.getItem('requestDetails'))
        this.props.driverEndTrip(socket, {
            ...requestDetails
        })
        this.props.history.push('/driver/trip-ended')
        
        const tripData = {
            driverId: requestDetails.driverId,
            riderId:  requestDetails.rider._id,
            tripId:   requestDetails._id
        }
        this.props.openModal({shouldOpen:true, component:DriverTripReviewPage, data:tripData});
        this.resetTrip();
        this.hideDirecitonsUI();
    }
    
    //============================================
    //  EDGE CASES  -  CANCELLATIONS & OFFLINE
    //============================================
    /**
     *  CANCEL TYPE  -  Trip 'Request' Cancelled By Rider
     */
    onTripRequestCanceledByRider = ()=>{
        this.setState({
            driverStatus:"standby",
            requestDetails: null,
        }) //Save request details
        console.log(
            'You have a new request! \n'
        )
        // removeLocal('requestDetails')
        helper.removeTrip()
        this.props.history.push('/driver/standby')
    }
    
    /**
     *  CANCEL TYPE  -  Trip Cancelled By Rider
     */
    onTripCanceledByRider = ()=>{
        this.setState({
                          driverStatus:"standby",
                          headerMessage:"The trip has been cancelled. Finding another ride for you",
                          requestDetails: null
                      }) //Save request details
        
        console.log(
        'TRIP_CANCELED_BY_RIDER! \n'
         )
        helper.removeTrip()
        document.querySelectorAll('.driver-map')[0].classList.add('hide-direction')
        
        this.resetTrip()
        
        this.props.history.push('/driver/standby')
    }
    
    /**
     *  CANCEL TYPE  -  Cancel Ride
     *  onClick event listener
     */
    onTripCanceledByDriver = (data)=>{
            console.log(
                'TRIP_CANCELED_BY_DRIVER! \n'
            )
            this.setState({
                driverStatus:"standby",
                requestDetails: null
            })
        
            this.resetTrip()
        
            // removeLocal('requestDetails')
            helper.removeTrip()
            document.querySelectorAll('.driver-map')[0].classList.add('hide-direction')
            this.props.history.push('/driver/standby')
    }
    
    /**
     *  CANCEL TYPE  -  GO OFFLINE
     *  onClick event listener
     */
    handleDriverGoOffline = () => {
        console.log('DRIVER_GO_OFFLINE', )
        this.props.driverGoOffline(socket, {
        })
        this.unbindListeners();
        this.resetTrip()
        this.props.history.push('/driver/offline')
    }
    
    componentDidMount() {
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
            this.setState({
                location: [position.coords.longitude, position.coords.latitude],
            })
    
            this.updateDriverLocation()
    
            this.map = new mapboxgl.Map({
                container: this.mapContainer.current, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 15,
            })
            
            // Add Markers
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
                // const instruction = document.querySelectorAll(".mapbox-directions-instructions")[0]
            })
            
            this.map.on('load', () => {
                this.startInput = document.querySelectorAll(".mapbox-directions-origin input")[0]
                this.destInput = document.querySelectorAll(".mapbox-directions-destination input")[0]
                console.log("document.querySelectorAll(\".mapbox-directions-instructions\")", document.querySelectorAll(".mapbox-directions-instructions"))
            })
            
            this.map.addControl(this.directions, 'top-left')
            this.map.addControl(new mapboxgl.NavigationControl());
    
        })
        this.bindListeners()
    }
    
    componentWillUnmount = () => {
        
        if (this.map) {
            this.unbindListeners();
            setTimeout(() => this.map.remove(), 3000)
        }
    }
    
    
    bindListeners(){
        socket.on('TRIP_CANCELED_BY_DRIVER', this.onTripCanceledByDriver)
        socket.on('TRIP_CANCELED_BY_RIDER', this.onTripCanceledByRider)
        socket.on('TRIP_CONFIRMED_BY_RIDER', this.onTripConfirmedByRider)
        socket.on('TRIP_REQUEST_CANCELED_BY_RIDER', this.onTripRequestCanceledByRider)
        socket.on('TRIP_REQUESTED_BY_RIDER', this.onTripRequestedByRider)
    }
    
    unbindListeners = ()=>{
        socket.off('TRIP_CANCELED_BY_DRIVER')
        socket.off('TRIP_CANCELED_BY_RIDER')
        socket.off('TRIP_CONFIRMED_BY_RIDER')
        socket.off('TRIP_REQUEST_CANCELED_BY_RIDER')
        socket.off('TRIP_REQUESTED_BY_RIDER')
        console.log('unbindListeners')
    }
  
    
    resetTrip = () => {
        // localStorage.removeItem('requestDetails')
        if (this.directions){
            this.directions.setOrigin(this.state.startLocation)
            this.directions.removeRoutes();
        }
        const destinationInput = document.querySelectorAll(".mapbox-directions-destination input")[0]
        if (destinationInput) {
            destinationInput.value = ''
        }
        this.map.zoom = 15
    }
    
    cancelTrip = (e) => {
        this.props.driverCancelTrip(socket, {
            tripId:this.state.tripId
        })
        this.startInput.value = ""
        this.destInput.value = ""
    }
    
    hideDirecitonsUI = ()=>{
        document.querySelectorAll('.driver-map')[0].classList.add('hide-direction')
    }
    
    removeMarkers = ()=>{
    }
    
    getStatePath = (path) => {
        return path.split('/driver/')[1]
    }
    
    render() {
        const path = this.getStatePath(this.props.location.pathname)
        let requestDetails
        
        requestDetails = JSON.parse(localStorage.getItem('requestDetails')) || this.state.requestDetails; // JSON.parse( localStorage.getItem('requestDetails')) || this.state.requestDetails;
       
        const statusPanel = () => {
            switch(path) {
                case "offline": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>Ready to drive?</h1>
                        <button className={'request-ride-button'} onClick={this.handleDriverGoOnline}>GO ONLINE</button>
                    </div>
                )
                case "standby": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>Finding Trip for you...</h1>
                        <Loader type="Rings" color="#3ACCE1" height={100} width={100} />
                        <button  className={'request-ride-button'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</button>
                    </div>
                )
                case "requestIncoming": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>You have 1 request. Accept Now?</h1>
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
                        <h1 className={`status-panel__header text-blue`}>Waiting for rider confirmation...</h1>
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
                            <h1 className={`status-panel__header inline`}>Trip Confirmed. <span className={"text-blue"}>Drive to rider</span></h1>
                            <div className={'action-icon-button-bar right'}>
                                <IconButton className={'driver-item-icon-button'}>
                                    <img src={IconMessage} alt={"message icon"}/>
                                </IconButton>
                                <IconButton className={'driver-item-icon-button'}>
                                    <img src={IconPhone} alt={"phone icon"}/>
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
                        <h1 className={`status-panel__header`}>Start Driving to Rider</h1>
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
                    </div>
                )
                case "trip-started": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>Trip Started. <span className={"text-blue"}>Drive to Destination</span></h1>
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
                            <button className={"driver-item-accept-button"} onClick={this.handleEndTrip}>
                                END TRIP
                            </button>
                        </div>
                        
                        <button className={'request-ride-button'} >
                               <div><img src={IconPhone} alt={"phone icon"} /> Call Support</div>
                         </button>
                    </div>
                )
                case "trip-ended": return (
                    <div className={'status-panel'}>
                        <h1 className={`status-panel__header`}>Trip Ended</h1>
                        <div className="drivers-nearby-container-list">Trip Ended</div>
                    </div>
                )
                default: return <h1>No match</h1>
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
    shouldResetTrip:tripReducer.shouldResetTrip
})

export default connect(
    mapStateToProps,
    { updateDriverLocation,
        driverGoOnline,
        driverGoOffline,
        acceptTrip,
        driverCancelTrip,
        driverStartTrip,
        driverEndTrip,
        openModal
    }
)(DriverHomePage);

