import axios from 'axios'
const mapboxBaseURL = 'https://api.mapbox.com/directions/v5/mapbox/'
import * as logger from './logger'
import dotenv from 'dotenv'
dotenv.config()

export default class MapBoxAPIClient {
    // url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coord1[0]},${coord1[1]};${coord2[0]},${coord2[1]}?geometries=geojson&steps=true&&access_token=${key}`
    async getDistanceAndDuration(coord1,coord2, type="driving"){
        logger.debug('coord1',coord1)
        logger.debug('coord2',coord2)
        const url = `${mapboxBaseURL}/${type}/${coord1[0]},${coord1[1]};${coord2[0]},${coord2[1]}?geometries=geojson&&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
        try{
            const response = await axios.get(url)
            
            console.log("response", response)
            return response
        }catch (e) {
            return logger.debug(e)
        }
    }

}
// https://api.mapbox.com/directions/v5/mapbox/driving/-122.03828449999999%2C37.9603201%3B-122.463158%2C37.764793?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1Ijoid2VuZ2VsbGVuIiwiYSI6ImNqdmFqZGNzMDFjeHI0NG50cWtsa2IxdTYifQ.dLH4hlAWnh8Xq6hMFe42_Q
