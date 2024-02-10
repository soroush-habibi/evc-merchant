import express from "express";
import authRouter from "./authRouter.js";
import productRouter from "./productRouter.js";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);

indexRouter.use("/product", productRouter);

export default indexRouter;