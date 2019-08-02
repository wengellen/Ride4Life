import { Router } from 'express'
import {getMe, getRiderProfile, updateRiderProfile, getRiderTrips, updateRiderLocation, requestTrip, fetchNearestDriver } from './rider.controllers'

const router = Router()

router.get('/', getMe)
router.get('/drivers', fetchNearestDriver)
router.get('/profile', getRiderProfile)
router.put('/profile', updateRiderProfile)
router.get('/trips', getRiderTrips)
router.put('/location', updateRiderLocation)
router.post('/request', requestTrip)

export default router
