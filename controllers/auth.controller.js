import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import { AT_AGE, RT_AGE } from '../constants/jwtAge.js'

export const register = async newUser => {
  try {
    const { username, password, firstName, lastName } = newUser
    const candidate = await User.findOne({ username })
    if (candidate) {
      throw new Error(`User with username ${username} already exists`)
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ username, password: hashedPassword, firstName, lastName })
    await user.save()

    const { accessToken, refreshToken } = generateTokens(user._id)

    await updateRefreshToken(user._id, refreshToken)
    return formatUserResponse(user, accessToken, refreshToken)
  } catch (e) {
    throw e
  }
}

export const login = async (username, password) => {
  try {
    const user = await User.findOne({ username }).select('+password')
    if (!user) {
      throw new Error(`User with username ${username} not found`)
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials')
    }
    const { accessToken, refreshToken } = generateTokens(user._id)
    await updateRefreshToken(user._id, refreshToken)
    return formatUserResponse(user, accessToken, refreshToken)
  } catch (e) {
    throw e
  }
}

export const auth = async id => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new Error(`User with id ${id} not found`)
    }
    const { accessToken, refreshToken } = generateTokens(user._id)

    await updateRefreshToken(user._id, refreshToken)

    return formatUserResponse(user, accessToken, refreshToken)
  } catch (e) {
    throw e
  }
}

export const refreshTokens = async (userId, refreshToken) => {
  try {
    const user = await User.findById(userId).select('+hashedRt')

    if (!user || !user.hashedRt) {
      throw new Error(`Access denied`)
    }

    const isRefreshTokenCorrect = await bcrypt.compare(refreshToken, user.hashedRt)

    if (!isRefreshTokenCorrect) {
      throw new Error(`Access denied`)
    }

    await user.save()

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id)
    await updateRefreshToken(user._id, newRefreshToken)

    return formatUserResponse(user, accessToken, newRefreshToken)
  } catch (e) {
    throw e
  }
}

export const logout = async userId => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error(`User with id ${userId} not found`)
    }
    user.hashedRt = null
    await user.save()
  } catch (e) {
    throw e
  }
}

const generateTokens = id => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_SECRET, {
    expiresIn: AT_AGE,
  })
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
    expiresIn: RT_AGE,
  })
  return { accessToken, refreshToken }
}

const updateRefreshToken = async (userId, refreshToken) => {
  try {
    const hashedRt = await bcrypt.hash(refreshToken, 12)
    const user = await User.findById(userId)

    if (!user) {
      throw new Error(`User with id ${userId} not found`)
    }

    user.hashedRt = hashedRt

    await user.save()
  } catch (e) {
    throw e
  }
}

const formatUserResponse = (user, accessToken, refreshToken) => {
  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      news: user.news,
    },
    accessToken,
    refreshToken,
  }
}
