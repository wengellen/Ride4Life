import axios from 'axios'
const mapboxBaseURL = 'https://api.mapbox.com/directions/v5/mapbox/driving'
import * as logger from './logger'
import dotenv from 'dotenv'
dotenv.config()

export default class MapBoxAPIClient {
    async getDistanceAndDuration(coord1,coord2){
        const url = `${mapboxBaseURL}/${coord1[0]},${coord1[1]};${coord2[0]},${coord2[1]}?geometries=geojson&access_token=${process.env.MAPBOX_TOKEN}`
    
        try{
            const response = await axios.get(url)
            const leg = response.data.routes[0].legs[0]
            const {duration, distance} =  leg
            return {duration, distance}
        }catch (e) {
            return logger.debug(e)
        }
    }
}
