import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export default (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Auth error' })
    }
    req.user = jwt.verify(token, process.env.ACCESS_SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Auth error' })
  }
}
