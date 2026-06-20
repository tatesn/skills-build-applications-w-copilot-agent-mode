import mongoose from 'mongoose';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';
export const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    await mongoose.connect(MONGODB_URI);
};
export const disconnectDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        return;
    }
    await mongoose.disconnect();
};
export const getMongoReadyState = () => mongoose.connection.readyState;
