import { Router } from 'express'
import {getMe, getRiderProfile, getRiderTrips, updateRiderLocation,
requestTrip, fetchNearestDriver, updateProfile, reviewTrip } from './rider.controllers'

const router = Router()

router.get('/', getMe)
router.get('/drivers', fetchNearestDriver)
router.get('/profile', getRiderProfile)
router.get('/trips', getRiderTrips)
router.put('/location', updateRiderLocation)
router.post('/request', requestTrip)
router.post('/update-profile', updateProfile)

router.post('/:id/review-trip/:tripId', reviewTrip)
export default router


