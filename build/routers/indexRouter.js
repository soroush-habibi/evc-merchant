import express from "express";
import authRouter from "./authRouter.js";
const indexRouter = express.Router();
indexRouter.use("/auth", authRouter);
export default indexRouter;
