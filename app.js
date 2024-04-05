import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

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

// dbConnection()

export default app
