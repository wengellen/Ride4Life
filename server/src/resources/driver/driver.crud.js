
import {Driver} from './driver.model'

const getUserById = (id) => {
    return Driver.findById(id)
    .exec()
}

const getAllUsers = () => {
    return Driver.find({})
    .exec()
}

const createUser = (userDetails) => {
    return Driver.create(userDetails)
}
const removeUserById = (id) => {
    return Driver.findByIdAndDelete(id).exec()
}

const updateUserById = (id, update) => {
    return Driver.findByIdAndUpdate(id, update, {new: true}).exec()
}

export const crud = {
    getUserById,
    getAllUsers,
    createUser,
    removeUserById,
    updateUserById
}
