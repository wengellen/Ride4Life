
import {Trip} from './trip.model'

const getById = (id) => {
    return Trip.findById(id)
    .exec()
}

const getAll = () => {
    return Trip.find({})
    .exec()
}

const createOne = (userDetails) => {
    return Trip.create(userDetails)
}
const removeById = (id) => {
    return Trip.findByIdAndDelete(id).exec()
}

const updateById = (id, update) => {
    return Trip.findByIdAndUpdate(id, update, {new: true}).exec()
}

export const crud = {
    getById,
    getAll,
    createOne,
    removeById,
    updateById
}
