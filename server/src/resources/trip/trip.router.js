import { Router } from 'express'
import { getTrips, updateTrip, getTripById, requestTrip } from './trip.controllers'

const router = Router()

router.get('/', getTrips)
router.put('/', updateTrip)
router.get('/:id', getTripById)
router.post('/request', requestTrip)
// router.post('/:id/trip', requestTrip)
export default router
