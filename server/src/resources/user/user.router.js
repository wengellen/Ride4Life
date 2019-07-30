import { Router } from 'express'
import {getMe, getAllRiders, getAllTrips, getAllDrivers } from './user.controllers'

const router = Router()

router.get('/', getMe )
router.get('/drivers', getAllDrivers)
router.get('/riders', getAllRiders)
router.get('/trips', getAllTrips)
router.get('/trips', getAllTrips)

export default router
