import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    // only we use in nextJS
    if (connection.isConnected) {
        console.log("Already DB Connected for ShowSpot ");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI! || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected Successfully for ShowSpot ");
        
    } catch (error) {
        console.log("DB Failed To Connect", error);
        process.exit(1)
    }

}

export default dbConnect