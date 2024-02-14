import express from "express";
import authRouter from "./authRouter.js";
import productRouter from "./productRouter.js";
import adminRouter from "./adminRouter.js";
import inventoryRouter from "./inventoryRouter.js";
import documentRouter from "./documentRouter.js";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);

indexRouter.use("/product", productRouter);

indexRouter.use("/admin", adminRouter);

indexRouter.use("/inventory", inventoryRouter);

indexRouter.use("/document", documentRouter);

export default indexRouter;