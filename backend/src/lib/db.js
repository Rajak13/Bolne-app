import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Database successfully connected: ", conn.connection.host)
    } catch (error) {
        console.log("Error connecting to Database ", error)
        process.exit(1)
    }
}
