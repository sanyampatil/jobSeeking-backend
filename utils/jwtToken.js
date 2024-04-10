import { config } from 'dotenv'
config({ path: './.env' })

console.log('expire cookie', process.env.COOKIE_EXPIRE)

export const sendToken = (user, statusCode, res, message) => {
  console.log('this is a 1')

  const token = user.getJWTToken()
  console.log(token)
  console.log('this is a 2 ')

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true // Set httpOnly to true
  }
  console.log('this is a 2')

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    message,
    token
  })
}
