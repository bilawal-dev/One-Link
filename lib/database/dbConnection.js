import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI // MongoDB URI

async function connectToDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to DB');
    return
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully Connected To DB');
  } catch (error) {
    console.error('Failed To Connect To DB', error.message);
  }
}

export default connectToDB