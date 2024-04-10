import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jobRouter from './routes/job.Router.js'
import userRouter from './routes/users.Router.js'
import applicationRouter from './routes/application.Router.js'

const app = express()
config({ path: './env' })

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/user', userRouter)
app.use('/api/v1/job', jobRouter)
app.use('/api/v1/application', applicationRouter)

app.use(errorMiddleware)

export default app
