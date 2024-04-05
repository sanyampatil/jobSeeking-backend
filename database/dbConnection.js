import mongoose from 'mongoose'
// import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      'mongodb://127.0.0.1:27017/sanyam'
    )
    console.log(
      `\n MongoDB connected ! DB host: ${connectionInstance.connection.host}`
    )
  } catch (error) {
    console.log('MONGODB connection error: ', error)
    process.exit(1)
  }
}

export default connectDB
