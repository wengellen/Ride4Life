
import {Driver} from './driver.model'

const getDriverById = (id) => {
    return Driver.findById(id)
    .exec()
}

const getAllDrivers = () => {
    return Driver.find({})
    .exec()
}

const createDriver = (userDetails) => {
    return Driver.create(userDetails)
}

const removeDriverById = (id) => {
    return Driver.findByIdAndDelete(id).exec()
}

const updateDriverById = (id, update) => {
    return Driver.findByIdAndUpdate(id, update, {new: true, useFindAndModify:false}).exec()
}

export const updateDriverLocation = (id, location) =>{
    return updateDriverById(id,  {location})
}

export const updateDriverStatus = (id, status) =>{
    return updateDriverById(id,  {status:status})
}

export const crud = {
    getDriverById,
    getAllDrivers,
    createDriver,
    removeDriverById,
    updateDriverById,
    updateDriverLocation,
    updateDriverStatus
}
