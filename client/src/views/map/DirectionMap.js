import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
import './DirectionMap.css'
import PinkButton from '../../components/Button/PinkButton' // Updating node module will keep css up to date.
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import {
    findDriversNearby,
    getDriversById,
    sendTripRequest,
    updateRiderLocation,
} from '../../actions'
import socketIOClient from 'socket.io-client'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class DirectionMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location: [],
            startLocation: [],
            endLocation: [],
            distance: 0,
            longitude: 0,
            searchResultLayer: null,
            loadingMap: true,
            response: false,
            endpoint: 'http://127.0.0.1:7000',
        }
        this.socket = socketIOClient(this.state.endpoint)
    }

    componentDidMount() {
        let map, directions, geolocate
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

            this.props
                .findDriversNearby({
                    coordinates: [
                        position.coords.longitude,
                        position.coords.latitude,
                    ],
                    rider: rider,
                })
                .then(res => {
                    console.log('findDriversNearby res', res)
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

            map = new mapboxgl.Map({
                container: this.mapContainer, // See https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 13,
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
            })

            directions.on('route', function(e) {
                console.log(e.route) // Logs the current route shown in the interface.
            })

            geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                    watchPosition: true,
                },
            })

            map.addControl(directions, 'top-left')
            map.addControl(geolocate, 'top-right')

            map.on('load', () => {
                directions.setOrigin([
                    position.coords.longitude,
                    position.coords.latitude,
                ])
            })
        })
    }
    loadDriverProfile = (driver)=>{
        console.log('driver', driver)
        this.props.getDriversById(driver._id).then(() => {
            this.props.history.push(`/drivers/${driver.driver_id}`);
        });
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
        }

        this.socket.emit('REQUEST_TRIP', {
            rider: JSON.parse(localStorage.getItem('user')),
            ...tripRequest,
        })
    }

    render() {
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
                {/*<PinkButton className={"mapbox-directions-request-button"} >Request Ride</PinkButton>*/}
                <PinkButton
                    type="button"
                    onClick={() => this.handleRequestRide()}
                    style={{
                        zIndex: '1000',
                        bottom: '75px',
                        display: 'block',
                        position: 'absolute',
                        margin: '0px auto',
                        padding:0,
                        lineHeight:'1.2rem',
                        color: '#fff',
                        background: '#ee8a65',
                        borderRadius: '50px',
                        width: '90px',
                        height: '90px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        // border: '1px solid white',
                        boxShadow: '1px 1px 0 8px rgba(255,255,255,0.2)',
                        justifySelf: 'center',
                    }}
                >
                    Request
                </PinkButton>
                <div className="drivers-nearby-container">
                    {this.props.driversNearby && this.props.driversNearby.map((driver, idx) => {
                        return <div className="driver-item-container" key={idx}
                                    onClick={e => this.loadDriverProfile(driver)}>
                            <div className="driver-item-content">
                                <h2>{driver.username}</h2>
                                <h3>2 mi
                                    <span>{`, ${driver.earnedRatings} stars` }</span>
                                </h3>
                            </div>
                            <div className="driver-img-container">
                                <img src="http://lorempixel.com/500/500" alt={"driver"}/>
                            </div>
                           
                        </div>
                    })}
                </div>
                <div
                    ref={el => (this.mapContainer = el)}
                    className="map"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                ></div>
            </div>
        )
    }
}
const mapStateToProps = ({riderReducer, tripReducer}) => (
    {
        findNearbyDriverStarted:riderReducer.findNearbyDriverStarted,
        driversNearby: riderReducer.driversNearby,
        submitDriverReviewSuccessMessage:riderReducer.submitDriverReviewSuccessMessage
    }
)

export default connect(
    mapStateToProps,
    { findDriversNearby, sendTripRequest, getDriversById, updateRiderLocation }
)(DirectionMap)
