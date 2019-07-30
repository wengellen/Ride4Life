import { Router } from 'express'
import {getMe, getDriverProfile, updateDriverProfile, getDriverTrips, updateDriverLocation, quoteTrip } from './driver.controllers'

const router = Router()

router.get('/', getMe)
router.get('/profile', getDriverProfile)
router.put('/profile', updateDriverProfile)
router.get('/trips', getDriverTrips)
router.put('/location', updateDriverLocation)
router.put('/quote', quoteTrip)

// router.post('/:id/trip', requestTrip)
export default router

