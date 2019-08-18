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
            driverStatus:"offline"
        }
        this.socket = socketIOClient(this.state.endpoint)
        // this.driver=JSON.parse(localStorage.getItem('user'))
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
              },
                // this.props
                // .findDriversNearby({
                //     coordinates: [
                //         position.coords.longitude,
                //         position.coords.latitude,
                //     ],
                // })
                // .then(res => {
                //     console.log('findDriversNearby res', res)
                // })
            )
            
            this.socket.on('REQUEST_TRIP', data => {
                const requestDetails = data
                console.log('data',data)
    
                this.setState({
                    driverStatus:"requestIncoming",
                    requestDetails: data,
                     }) //Save request details
                console.log(
                    'You have a new request! \n' +
                        JSON.stringify(requestDetails)
                )
                
            })
            
            this.socket.on('CONFIRM_TRIP', data => {
                const requestDetails = data
                this.setState({ requestDetails: data }) //Save request details

                console.log(
                    'Rider has accept your service! \n' +
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

    handleAcceptTrip = () => {
        console.log('ACCEPT_TRIP', )
        this.socket.emit('ACCEPT_TRIP', {
            driver: JSON.parse(localStorage.getItem('user')),
            ...this.state.requestDetails,
        })
        
    }
    
    handleDriverGoOnline = () => {
        console.log('DRIVER_GO_ONLINE', )
        this.socket.on('DRIVER_READY_TO_ACCEPT_TRIP', () => {
            console.log(
                'DRIVER_READY_TO_ACCEPT_TRIP! \n'
            )
            this.setState({driverStatus:"standby"})
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
        const { driverStatus, requestDetails } = this.state
        const statusPanel = () => {
            switch(driverStatus) {
                case "offline": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header`}>Ready to work?</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur dolor sit amet,
                            consectetur
                        </p>
                        <Button className={'request-ride-button'} onClick={this.handleDriverGoOnline}>GO ONLINE</Button>
                    </div>
                  )
                case "standby": return (
                        <div className={'status-panel'}>
                            <h1 className={`drivers-nearby-header`}>Finding Trip for you</h1>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur dolor sit amet,
                                consectetur
                            </p>
                            <Button  className={'request-ride-button bordered'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</Button>
                        </div>
                    )
                case "requestIncoming": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header`}>Finding Trip for you</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur dolor sit amet,
                            consectetur
                        </p>
                        {!this.state.requestDetails.rider
                            ? (<Loader/>)
                            :
                               (<div className="driver-item-container-list">
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
                                <div className={"driver-item-buttons-list"}>
                                            <div className={"driver-item-price"}><span>${requestDetails.tripFare}</span></div>
                                            <IconButton className={"driver-item-accept-button"}
                                                        onClick={()=> this.handleAcceptTrip()}>ACCEPT</IconButton>
                                </div>
                            </div>)}
                        <Button  className={'request-ride-button bordered'}  onClick={this.handleDriverGoOffline}>GO OFFLINE</Button>
                    </div>
                )
                case "confirmed": return (
                    <div className={'status-panel'}>
                        <h1 className={`drivers-nearby-header show-bg`}>Drive to pickup locaiton</h1>
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
                        <Button className={'request-ride-button bordered'}>CANCEL TRIP</Button>
                    </div>
                )
                default:      return <h1>No project match</h1>
            }
        }
    
        return (
         <div
                className="map-wrapper"
                style={{ position: 'relative', display: 'flex' }}
            >
                
                <div
                    ref={el => (this.mapContainer = el)}
                    className="driver-map"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                ></div>
             {statusPanel()}
             
             {/*<div className="drivers-nearby-container-list">*/}
             {/*    {this.state.requestDetails &&*/}
             {/*    this.state.requestDetails.map((trip, idx) => {*/}
             {/*        return (*/}
             {/*            <div*/}
             {/*                className="driver-item-container-list"*/}
             {/*                key={idx}*/}
             {/*            >*/}
             {/*                <div className="driver-img-container-list">*/}
             {/*                    <img*/}
             {/*                        src={driver.avatar}*/}
             {/*                        alt={'driver'}*/}
             {/*                    />*/}
             {/*                </div>*/}
             {/*                <div className="driver-item-content-list">*/}
             {/*                    <h2>{driver.username}</h2>*/}
             {/*                    <h3>*/}
             {/*                        2 miles away*/}
             {/*                        <span> {`, ${driver.rating} `}stars</span>*/}
             {/*                    </h3>*/}
             {/*                </div>*/}
             {/*                <div className={"driver-item-buttons-list"}>*/}
             {/*                    {*/}
             {/*                        driverStatus === "requesting"*/}
             {/*                            ? <>*/}
             {/*                                <div className={"driver-item-price"}><span>$20</span></div>*/}
             {/*                                <IconButton className={"driver-item-accept-button"}*/}
             {/*                                            onClick={()=> this.handleConfirmRequest(driver)}>ACCEPT</IconButton>*/}
             {/*                            </>*/}
             {/*                            :*/}
             {/*                            <div className={"action-icon-button-bar"}>*/}
             {/*                                <IconButton className={"driver-item-icon-button"}>*/}
             {/*                                    <ChatBubbleIcon />*/}
             {/*                                </IconButton>*/}
             {/*                                <IconButton className={"driver-item-icon-button"}>*/}
             {/*                                    <PhoneIcon />*/}
             {/*                                </IconButton>*/}
             {/*                            </div>*/}
             {/*                    }*/}
             {/*       */}
             {/*                </div>*/}
             {/*                <IconButton className={"right-arrow-button"}*/}
             {/*                            onClick={e =>*/}
             {/*                                this.loadDriverProfile(driver)*/}
             {/*                            }>*/}
             {/*                    <RightArrowIcon />*/}
             {/*                </IconButton>*/}
             {/*            </div>*/}
             {/*        )*/}
             {/*    })}*/}
             {/*</div>*/}
             {/*<div className={'status-panel'}>*/}
             {/*    <h1 className={`drivers-nearby-header`}>{"Ready for work"}</h1>*/}
             {/*    <p>*/}
             {/*        Lorem ipsum dolor sit amet, consectetur dolor sit amet,*/}
             {/*        consectetur*/}
             {/*    </p>*/}
             
             {/*    {returnButton()}*/}
             {/*</div>*/}
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
