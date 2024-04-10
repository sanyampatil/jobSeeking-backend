import { catchAsyncErrors } from '../middleware/catchAsyncError.js'
import { User } from '../model/user.model.js'
import ErrorHandler from '../middleware/error.js'
import { sendToken } from '../utils/jwtToken.js'
export const register = catchAsyncErrors(async (req, res, next) => {
  console.log('hii i my in register')
  const { name, email, phone, password, role } = req.body
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler('Please fill full form!'))
  }

  console.log('hii-1')
  const isEmail = await User.findOne({ email })
  if (isEmail) {
    return next(new ErrorHandler('Email already registered!'))
  }

  console.log('hii-2')

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role
  })
  console.log('hii-3')

  sendToken(user, 201, res, 'User Registered!')

  console.log('hii-4')
})

export const login = catchAsyncErrors(async (req, res, next) => {
  console.log('hiiii in Login')

  const { email, password, role } = req.body
  console.log(email, password, role)
  if (!email || !password || !role) {
    return next(new ErrorHandler('Please provide email ,password and role.'))
  }
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new ErrorHandler('Invalid Email Or Password.', 400))
  }
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email Or Password.', 400))
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    )
  }
  sendToken(user, 201, res, 'User Logged In!')
})

export const logout = catchAsyncErrors(async (req, res, next) => {
  console.log('in logout ')
  res
    .status(201)
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now())
    })
    .json({
      success: true,
      message: 'Logged Out Successfully.'
    })
})

export const getUser = catchAsyncErrors((req, res, next) => {
  console.log('in getuser')
  const user = req.user
  console.log('user1')
  res.status(200).json({
    success: true,
    user
  })
})
