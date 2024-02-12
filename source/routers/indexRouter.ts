import express from "express";
import authRouter from "./authRouter.js";
import productRouter from "./productRouter.js";
import adminRouter from "./adminRouter.js";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);

indexRouter.use("/product", productRouter);

indexRouter.use("/admin", adminRouter);

export default indexRouter;