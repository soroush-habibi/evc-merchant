import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { checkEnv } from './utils/checkEnv.js';
import path from 'path';
import { fileURLToPath } from "url";
import errorHandler from './middlewares/errorHandler.js';
import indexRouter from './routers/indexRouter.js';
import mongoose from 'mongoose';
checkEnv("APP_PORT", "JWT_SECRET", "DB_URL");
let temp = path.dirname(fileURLToPath(import.meta.url)).split('');
temp.splice(temp.length - 6);
const ROOT = temp.join('');
process.env.ROOT = ROOT;
await mongoose.connect(process.env.DB_URL).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log(err);
    process.exit(1);
});
const app = express();
//!-----------PARSING MIDDLEWARES-----------
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//!-----------SECURITY MIDDLEWARES-----------
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Limit reached'
}));
app.use(helmet());
app.use(cors());
//!-----------MAIN MIDDLEWARES-----------
app.use(indexRouter);
app.use((req, res, next) => {
    res.status(404).json({
        message: "not found!"
    });
});
//!-----------HANDLERS MIDDLEWARES-----------
app.use(errorHandler);
app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`App is running on port ${process.env.APP_PORT || 3000}`);
});
