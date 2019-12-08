
import {Rider} from './rider.model'

const getUserById = (id) => {
    return Rider.findById(id)
    .exec()
}

const getAllUsers = () => {
    return Rider.find({})
    .exec()
}

const createUser = (userDetails) => {
    return Rider.create(userDetails)
}
const removeUserById = (id) => {
    return Rider.findByIdAndDelete(id).exec()
}

const updateUserById = (id, update) => {
    return Rider.findByIdAndUpdate(id, update, {new: true}).exec()
}

export const crud = {
    getUserById,
    getAllUsers,
    createUser,
    removeUserById,
    updateUserById
}
