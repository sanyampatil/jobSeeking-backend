import { config } from 'dotenv'
config()

import app from './app.js'
import connectDB from './database/dbConnection.js'
app.get('hii', (req, res) => {
  console.log('hii zal ka jevan')
})
app.listen(process.env.PORT, () => {
  connectDB()
  console.log(`Server running at port ${process.env.PORT}`)
})
