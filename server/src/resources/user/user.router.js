import {Router} from 'express'
import {getAccount, updateAccount} from './user.controllers'

const router = Router()

router.get('/', getAccount)
router.put('/', updateAccount)

export default router
