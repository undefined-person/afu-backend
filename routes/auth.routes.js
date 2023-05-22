import Router from 'express'
import { check, validationResult } from 'express-validator'

import { register, login, auth, refreshTokens, logout } from '../controllers/auth.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { REFRESH_COOKIE_AGE } from '../constants/jwtAge.js'

const router = Router()

router.post(
  '/register',
  [
    check('username', 'Username must be at least 3 characters long and less than 20').isLength({
      min: 3,
      max: 20,
    }),
    check('password', 'Password must be at least 6 characters long and less than 40').isLength({
      min: 6,
      max: 40,
    }),
    check('firstName', 'First name is required').exists(),
    check('lastName', 'Last name is required').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      const { user, accessToken, refreshToken } = await register(req.body)
      res.cookie('refreshToken', refreshToken, {
        maxAge: REFRESH_COOKIE_AGE,
        httpOnly: true,
      })
      res.json({
        user,
        accessToken,
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: e.message })
    }
  }
)

router.post(
  '/login',
  [
    check('username', 'Username must be at least 3 characters long').isLength({
      min: 3,
    }),
    check('password', 'Password must be at least 6 characters long').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      const { username, password } = req.body
      const { user, accessToken, refreshToken } = await login(username, password)
      res.cookie('refreshToken', refreshToken, {
        maxAge: REFRESH_COOKIE_AGE,
        httpOnly: true,
      })
      res.json({
        user,
        accessToken,
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: e.message })
    }
  }
)

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { user, accessToken } = await auth(req.user.id)

    res.json({
      user,
      accessToken,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const { refreshToken: rt } = req.cookies
    const { user, accessToken, refreshToken } = await refreshTokens(req.user.id, rt)
    res.cookie('refreshToken', refreshToken, {
      maxAge: REFRESH_COOKIE_AGE,
      httpOnly: true,
    })

    res.json({
      user,
      accessToken,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await logout(req.user.id)
    res.clearCookie('refreshToken')
    res.json({ message: 'Logged out' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

export default router
