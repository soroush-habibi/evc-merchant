import express from "express";
import authRouter from "./authRouter.js";
import productRouter from "./productRouter.js";
import adminRouter from "./adminRouter.js";
import inventoryRouter from "./inventoryRouter.js";
import documentRouter from "./documentRouter.js";
import storeRouter from "./storeRouter.js";
import orderRouter from "./orderRouter.js";
import statsRouter from "./statsRouter.js";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);

indexRouter.use("/product", productRouter);

indexRouter.use("/admin", adminRouter);

indexRouter.use("/inventory", inventoryRouter);

indexRouter.use("/document", documentRouter);

indexRouter.use("/store", storeRouter);

indexRouter.use("/order", orderRouter);

indexRouter.use("/stats", statsRouter);

export default indexRouter;