import { Router } from 'express'
import {getMe, getDriverById, getDriverTrips, updateDriverLocation,
quoteTrip, uploadProfilePhoto, updateProfile, reviewTrip } from './driver.controllers'

const router = Router()

router.get('/', getMe)
router.get('/:id', getDriverById)
router.get('/trips', getDriverTrips)
router.put('/location', updateDriverLocation)
router.put('/quote', quoteTrip)
router.post('/update-profile', updateProfile)
router.post('/uploadProfilePhoto', uploadProfilePhoto)
router.post('/:id/review-trip/:tripId', reviewTrip)

export default router
