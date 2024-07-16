import mongoose from 'mongoose';

const connectDB = mongoose.connect(process.env.MONGO_URL,{
    appName : "File Sharing App",
})

export default connectDB;