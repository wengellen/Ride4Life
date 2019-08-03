import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css' // Updating node module will keep css up to date.
import './DirectionMapDriver.css'
import PinkButton from '../../components/Button/PinkButton' // Updating node module will keep css up to date.
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import {
    updateDriverLocation,
} from '../../actions'
import socketIOClient from 'socket.io-client'

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
            endpoint: 'http://127.0.0.1:7000',
        }
        this.socket = socketIOClient(this.state.endpoint)
    }

    componentDidMount() {
        let map, directions, geolocate
        const driver = JSON.parse(localStorage.getItem('user'))
        
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
            })
            
            this.socket.on('REQUEST_TRIP', data => {
                const requestDetails = data
                this.setState({ requestDetails: data }) //Save request details

                console.log(
                    'You have a new request! \n' +
                        JSON.stringify(requestDetails)
                )
            })

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
        })
    }

    handleSendTripEstimate = () => {
        this.socket.emit('SEND_TRIP_ESTIMATE', {
            driver: JSON.parse(localStorage.getItem('user')),
            ...this.state.requestDetails,
        })
    }

    render() {
        return (
         <div
                className="map-wrapper"
                style={{ position: 'relative', display: 'flex' }}
            >
                <PinkButton
                    type="button"
                    onClick={() => this.handleSendTripEstimate()}
                    style={{
                        zIndex: '1000',
                        bottom: '120px',
                        display: 'block',
                        position: 'absolute',
                        margin: '0px auto',
                        textAlign: 'center',
                        color: '#fff',
                        background: "linear-gradient(60deg, #26c6da, #00acc1)",
                        boxShadow: "0 12px 20px -10px rgba(0, 172, 193, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 172, 193, 0.2)",
                        borderRadius: '50%',
                        width: '140px',
                        height: '140px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: '1px solid white',
                        justifySelf: 'center',
                    }}
                >
                    Accept Ride
                </PinkButton>
                <div
                    ref={el => (this.mapContainer = el)}
                    className="driver-map"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                ></div>
            </div>
        )
    }
}
const mapStateToProps = ({ riderReducer, tripReducer }) => ({})

export default connect(
    mapStateToProps,
    { updateDriverLocation }
)(DirectionMapDriver)
