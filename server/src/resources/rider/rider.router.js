import { Router } from 'express'
import { getOne, updateOne, createOne } from './rider.controllers'

const router = Router()

router.get('/', getOne)
router.put('/', updateOne)
router.post('/', createOne)

export default router
