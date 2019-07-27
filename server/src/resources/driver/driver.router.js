import { Router } from 'express'
import { getOne, updateOne } from './driver.controllers'

const router = Router()

router.get('/', getOne)
router.put('/', updateOne)

export default router
