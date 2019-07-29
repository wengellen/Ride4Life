import { Router } from 'express'
import { getProfile, updateProfile, getHistory } from './rider.controllers'

const router = Router()

router.get('/', getProfile)
router.put('/', updateProfile)
router.get('/:id', getHistory)
// router.post('/:id/trip', requestTrip)
export default router
