import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}


const connection: ConnectionObject = {}


export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB is already connected");
        return;
    }
    try {
        const DB = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = DB.connections[0].readyState
        console.log("Database connected Sucessfully.")
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
};