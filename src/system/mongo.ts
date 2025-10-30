import mongoose from 'mongoose'
import { config } from './config'

export const initMongoDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri)
    console.log('MongoDB connected')
  } catch (error) {
    const msg = (error as Error).message
    throw new Error(msg)
  }
}
