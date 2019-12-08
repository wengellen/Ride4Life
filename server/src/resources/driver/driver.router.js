import { Router } from 'express'
import {getMe, getDriverById, updateDriverProfile, getDriverTrips, updateDriverLocation,
quoteTrip, uploadProfilePhoto, uploadProfile } from './driver.controllers'

const router = Router()

router.get('/', getMe)
router.get('/:id', getDriverById)
router.put('/:id', updateDriverProfile)
router.get('/trips', getDriverTrips)
router.put('/location', updateDriverLocation)
router.put('/quote', quoteTrip)
router.post('/uploadProfile', uploadProfile)
router.post('/uploadProfilePhoto', uploadProfilePhoto)

// router.post('/:id/trip', requestTrip)
export default router
