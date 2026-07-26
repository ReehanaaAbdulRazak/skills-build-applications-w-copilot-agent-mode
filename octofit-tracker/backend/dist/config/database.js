"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForDatabaseConnection = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose_1.default.connection;
const connectToDatabase = async () => {
    try {
        if (db.readyState === 1) {
            return;
        }
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
    }
    catch (error) {
        console.warn('MongoDB connection unavailable, continuing without database:', error);
    }
};
exports.connectToDatabase = connectToDatabase;
const waitForDatabaseConnection = async () => {
    if (db.readyState === 1) {
        return;
    }
    await new Promise((resolve, reject) => {
        const onOpen = () => {
            cleanup();
            resolve();
        };
        const onError = (error) => {
            cleanup();
            reject(error);
        };
        const cleanup = () => {
            db.off('open', onOpen);
            db.off('error', onError);
        };
        db.once('open', onOpen);
        db.once('error', onError);
    });
};
exports.waitForDatabaseConnection = waitForDatabaseConnection;
connectToDatabase();
db.on('error', console.error.bind(console, 'connection error:'));
exports.default = db;
