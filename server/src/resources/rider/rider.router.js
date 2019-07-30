import { Router } from 'express'
import { getProfile, updateProfile, getTripHistory, updateLocation } from './rider.controllers'

const router = Router()

router.get('/', getProfile)
router.put('/', updateProfile)
router.get('/:id/trips', getTripHistory)
router.put('/location', updateLocation)

export default router
