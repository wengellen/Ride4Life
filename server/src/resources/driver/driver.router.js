import { Router } from 'express'
import { getProfile, updateProfile, getTripHistory, updateCurrentLocation } from './driver.controllers'

const router = Router()

router.get('/', getProfile)
router.put('/', updateProfile)
router.get('/:id/trips', getTripHistory)
router.post('/:id', updateCurrentLocation)
// router.post('/:id/trip', requestTrip)
export default router

