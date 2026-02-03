import mongoose, { Mongoose } from "mongoose";

type MongooseCache = {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

declare global {
    var _mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

const cached: MongooseCache = global._mongoose || {
    conn: null,
    promise: null,
};

if (!global._mongoose) {
    global._mongoose = cached;
}

async function connectDB(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const options = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, options)
            .then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

export default connectDB;
