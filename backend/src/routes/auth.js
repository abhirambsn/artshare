import express from 'express'
import { changePassword, createUser, login, profile, resetPassword } from '../controllers/auth.js'
import { verifyAuth } from '../middlewares/authentication.js'

const router = express.Router()

router.get('/', verifyAuth, profile)
router.post('/login', login)
router.post('/register', createUser)
router.put('/changepassword', verifyAuth, changePassword)
router.put('/requestreset', (req, res) => {})
router.put('/reset/:token', resetPassword)

export default router