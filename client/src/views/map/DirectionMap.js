import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
import './DirectionMap.css'
import PinkButton from '../../components/Button/PinkButton' // Updating node module will keep css up to date.
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
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class DirectionMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location: [-122.431297, 37.7749],
            startLocation: [-122.431297, 37.7749],
            endLocation: [0, 0],
            endLocationAddress: null,
            distance: 0,
            longitude: 0,
            searchResultLayer: null,
            loadingMap: true,
            response: false,
            endpoint:
                process.env.NODE_ENV !== 'production'
                    ? 'http://localhost:7000'
                    : 'https://ride4lifer.herokuapp.com/',
            showEstimate: false,
            requestDetails: null,
            requestingRide: false,
            tripStatus:"standby",
            tripFare:0,
            tripId:null,
            acceptedDrivers:[]
        }
        this.socket = socketIOClient(this.state.endpoint)
        this.map = null
        this.directions = null
        this.geolocate = null
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

            // this.props
            //     .findDriversNearby({
            //         coordinates: [
            //             position.coords.longitude,
            //             position.coords.latitude,
            //         ],
            //         rider: rider,
            //     })
            //     .then(res => {
            //         console.log('findDriversNearby res', res)
            //     })

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

        this.directions.on('destination', e => {
            this.setState({
                endLocation: e.feature.geometry.coordinates,
            })
        })

        this.directions.on('route', e => {
            console.log(e.route) // Logs the current route shown in the interface.
            // if (!e.route) return
            // const {distance, legs, duration} = e.route[0]
            // this.setState({
            //     endLocationAddress: legs[0].summary,
            //     duration: duration || 0,
            //     distance: distance || 0,
            // })
        })

        this.geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
                watchPosition: true,
            },
        })

        this.map.addControl(this.directions, 'top-left')
        this.map.addControl(this.geolocate, 'top-right')

        this.map.on('load', () => {
            this.directions.setOrigin(this.state.startLocation)
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
            this.props.history.push(`/drivers/${driver._id}`)
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
            acceptedDrivers:[]
        })
        this.props.cancelTripRequest()
    
    }
    
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
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
            distance: this.state.distance,
            duration: this.state.duration,
            tripFare:this.state.tripFare,
        }

        this.setState({
            requestingRide: true,
            tripStatus:"requesting"
        })

        this.socket.emit('REQUEST_TRIP', {
            rider: JSON.parse(localStorage.getItem('user')),
            ...tripRequest,
        })
    
        this.socket.on('TRIP_REQUESTED', data => {
            this.setState({tripId:data})
            console.log(
                'TRIP_ID \n' + JSON.stringify(data)
            )
        })
        
        this.socket.on('ACCEPT_TRIP', data => {
            console.log('ACCEPT_TRIP data', data)
            this.setState({
                showEstimate: true,
                requestDetails: data,
                tripStatus:"driversFound",
                acceptedDrivers:[...this.state.acceptedDrivers, data.driver]
            }) //Save request details
            console.log(
                'A driver has accepted your trip \n' + JSON.stringify(data)
            )
        })
        // this.props
        //     .findDriversNearby({
        //         coordinates: this.state.startLocation,
        //         rider: JSON.parse(localStorage.getItem('user')),
        //     })
        //     .then(res => {
        //         console.log('findDriversNearby res', res)
        //     })
    }
    
    handleConfirmRequest = (idx) => {
        const driver = this.state.acceptedDrivers[idx]
        console.log('idx',idx)
        console.log('driver',driver)
        this.socket.emit('CONFIRM_TRIP', {
            driver,
            ...this.state.requestDetails,
        })
    
        this.props.confirmTripRequest(driver)
        
        this.setState({
            showEstimate: false,
        })
        
    }

    render() {
        const { findNearbyDriverMessage, driversNearby,  } = this.props
        const { requestingRide, tripFare, tripStatus, acceptedDrivers } = this.state
        const statusPanel = () => {
            switch(tripStatus) {
                case "standby": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header ${this.props.driversNearby.length > 0 && 'show-bg' }`}>{findNearbyDriverMessage}</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur dolor sit amet,
                            consectetur
                        </p>
                        <div>
                            $<input name={"tripFare"} type={"text"} placeholder={tripFare} onChange={this.handleChange}/>
                            <Button className={'request-ride-button'} onClick={this.handleRequestRide}>REQUEST RIDE</Button>
                        </div>
                    </div>
                  
                )
                case "requesting": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header ${this.props.driversNearby.length > 0 && 'show-bg' }`}>{findNearbyDriverMessage}</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur dolor sit amet,
                            consectetur
                        </p>
                        <div className="drivers-nearby-container-list">
                            {this.props.driversNearby &&
                            this.props.driversNearby.map((driver, idx) => {
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
                                            {
                                                tripStatus === "requesting"
                                                    ? <>
                                                        <div className={"driver-item-price"}><span>$20</span></div>
                                                        <IconButton className={"driver-item-accept-button"}
                                                                    onClick={()=> this.handleConfirmRequest(idx)}>ACCEPT</IconButton>
                                                    </>
                                                    :
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
                                        <IconButton className={"right-arrow-button"}
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
                case "driversFound": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header`}></h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur dolor sit amet,
                            consectetur
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
                                                    <IconButton className={"driver-item-accept-button"}
                                                                onClick={()=> this.handleConfirmRequest(idx)}>ACCEPT</IconButton>
                            
                                        </div>
                                        <IconButton className={"right-arrow-button"}
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
                case "pickup": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header ${this.props.driversNearby.length > 0 && 'show-bg' }`}>{findNearbyDriverMessage}</h1>
                        <div className="drivers-nearby-container-list">
                            { acceptedDrivers &&
                            this.props.driversNearby.map((driver, idx) => {
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
                                            {
                                                tripStatus === "requesting"
                                                    ? <>
                                                        <div className={"driver-item-price"}><span>$20</span></div>
                                                        <IconButton className={"driver-item-accept-button"}
                                                                    onClick={()=> this.handleConfirmRequest(driver)}>ACCEPT</IconButton>
                                                    </>
                                                    :
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
                                        <IconButton className={"right-arrow-button"}
                                                    onClick={e =>
                                                        this.loadDriverProfile(driver)
                                                    }>
                                            <RightArrowIcon />
                                        </IconButton>
                                    </div>
                                )
                            })}
                        </div>
                        <Button className={'request-ride-button bordered'}>CANCEL TRIP</Button>
                    </div>
                   )
                default:      return <h1>No project match</h1>
            }
        }
        
        return (
            // return this.state.loadingMap ? (
            //     <div
            //         style={{
            //             width: '100%',
            //             height: '100vh',
            //             display: 'flex',
            //             flexDirection: 'column',
            //             justifyContent: 'center',
            //             alignItems: 'center',
            //             backgroundColor: 'rgba(0,0,0,0.9)',
            //         }}
            //     >
            //         <Loader type="ThreeDots" color="white" height="50" width="50" />
            //         <h3>Loading...</h3>
            //     </div>
            // ) : (
            <div
                className="map-wrapper"
                style={{ position: 'relative', display: 'flex' }}
            >
                {/*<main*/}
                {/*    className={`trip-estimate-container ${*/}
                {/*        this.state.showEstimate ? 'show' : ''*/}
                {/*    }`}*/}
                {/*>*/}
                {/*    <div className="trip-estimate-content">*/}
                {/*        <p>Estimated Pickup Time: 4 Mins</p>*/}
                {/*        <h2>*/}
                {/*            $*/}
                {/*            {this.state.requestDetails &&*/}
                {/*                this.state.requestDetails.quote}*/}
                {/*        </h2>*/}
                {/*        <h1>Fare Estimate</h1>*/}
                {/*    </div>*/}
                {/*    <PinkButton*/}
                {/*        className="brown-btn"*/}
                {/*        onClick={this.handleConfirmRequest}*/}
                {/*    >*/}
                {/*        Confirm Ride Request*/}
                {/*    </PinkButton>*/}
                {/*</main>*/}
                {/*<PinkButton*/}
                {/*    type="button"*/}
                {/*    onClick={() => this.handleRequestRide()}*/}
                {/*    style={{*/}
                {/*        zIndex: '1000',*/}
                {/*        bottom: '75px',*/}
                {/*        display: 'block',*/}
                {/*        position: 'absolute',*/}
                {/*        margin: '0px auto',*/}
                {/*        padding: 0,*/}
                {/*        lineHeight: '1.2rem',*/}
                {/*        color: '#fff',*/}
                {/*        background: '#ee8a65',*/}
                {/*        borderRadius: '50px',*/}
                {/*        width: '90px',*/}
                {/*        height: '90px',*/}
                {/*        fontWeight: 'bold',*/}
                {/*        fontSize: '0.9rem',*/}
                {/*        boxShadow: '1px 1px 0 8px rgba(255,255,255,0.2)',*/}
                {/*        justifySelf: 'center',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Request*/}
                {/*</PinkButton>*/}
                <div
                    ref={el => (this.mapContainer = el)}
                    className="map"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                ></div>
                {statusPanel()}
                {/*<div className={'status-panel'}>*/}
                {/*    <h1 className={`drivers-nearby-header ${this.props.driversNearby.length > 0 && 'show-bg' }`}>{findNearbyDriverMessage}</h1>*/}
                {/*    <p>*/}
                {/*        Lorem ipsum dolor sit amet, consectetur dolor sit amet,*/}
                {/*        consectetur*/}
                {/*    </p>*/}
                {/*    <div className="drivers-nearby-container-list">*/}
                {/*        {this.props.driversNearby &&*/}
                {/*        this.props.driversNearby.map((driver, idx) => {*/}
                {/*            return (*/}
                {/*                <div*/}
                {/*                    className="driver-item-container-list"*/}
                {/*                    key={idx}*/}
                {/*                >*/}
                {/*                    <div className="driver-img-container-list">*/}
                {/*                        <img*/}
                {/*                            src={driver.avatar}*/}
                {/*                            alt={'driver'}*/}
                {/*                        />*/}
                {/*                    </div>*/}
                {/*                    <div className="driver-item-content-list">*/}
                {/*                        <h2>{driver.username}</h2>*/}
                {/*                        <h3>*/}
                {/*                            2 miles away*/}
                {/*                            <span> {`, ${driver.rating} `}stars</span>*/}
                {/*                        </h3>*/}
                {/*                    </div>*/}
                {/*                    <div className={"driver-item-buttons-list"}>*/}
                {/*                        {*/}
                {/*                            tripStatus === "requesting"*/}
                {/*                            ? <>*/}
                {/*                                    <div className={"driver-item-price"}><span>$20</span></div>*/}
                {/*                                    <IconButton className={"driver-item-accept-button"}*/}
                {/*                                                onClick={()=> this.handleConfirmRequest(driver)}>ACCEPT</IconButton>*/}
                {/*                               </>*/}
                {/*                           :*/}
                {/*                            <div className={"action-icon-button-bar"}>*/}
                {/*                                <IconButton className={"driver-item-icon-button"}>*/}
                {/*                                     <ChatBubbleIcon />*/}
                {/*                                </IconButton>*/}
                {/*                                <IconButton className={"driver-item-icon-button"}>*/}
                {/*                                      <PhoneIcon />*/}
                {/*                                </IconButton>*/}
                {/*                            </div>*/}
                {/*                        }*/}
                {/*                  */}
                {/*                    </div>*/}
                {/*                    <IconButton className={"right-arrow-button"}*/}
                {/*                        onClick={e =>*/}
                {/*                        this.loadDriverProfile(driver)*/}
                {/*                    }>*/}
                {/*                        <RightArrowIcon />*/}
                {/*                    </IconButton>*/}
                {/*                </div>*/}
                {/*            )*/}
                {/*        })}*/}
                {/*    </div>*/}
                
                {/*    {returnButton()}*/}
                {/*</div>*/}
            </div>
        )
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

export default connect(
    mapStateToProps,
    {
        findDriversNearby,
        sendTripRequest,
        getDriversById,
        updateRiderLocation,
        cancelTripRequest,
        confirmTripRequest
    }
)(DirectionMap)
